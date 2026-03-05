<?php
// auth.php
require_once '../../config/cors.php';
require_once '../../config/database.php';
$database = new Database();
$conn = $database->getConnection();

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// รองรับ preflight OPTIONS request
if ($method == 'OPTIONS') {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Preflight OK"]);
    exit;
}

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'] ?? '';

    if ($action == 'login') {
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            echo json_encode(["success" => false, "message" => "Username and password are required"]);
            exit;
        }

        try {
            $stmt = $conn->prepare("SELECT * FROM admin_users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                // Remove password from user object before sending
                unset($user['password']);
                
                // Update last login
                $updateStmt = $conn->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?");
                $updateStmt->execute([$user['id']]);

                echo json_encode([
                    "success" => true,
                    "message" => "Login successful",
                    "user" => $user,
                    "token" => base64_encode(json_encode(['id' => $user['id'], 'time' => time()])) // Simple token for session
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Invalid username or password"]);
            }
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid action"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
