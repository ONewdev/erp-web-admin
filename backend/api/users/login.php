<?php
// backend/api/users/login.php
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../utils/jwt.php'; // Includes config/app.php internally

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload. Payload must not be empty.'], JSON_UNESCAPED_UNICODE);
    exit();
}

$identifier = trim($data->identifier ?? $data->username ?? $data->email ?? '');
$password   = $data->password ?? '';

if (empty($identifier) || empty($password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน'], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    $database = new Database();
    $pdo = $database->getConnection();

    // Look up by username or email
    $stmt = $pdo->prepare("SELECT * FROM users_qsoft WHERE username = :identifier OR email = :identifier LIMIT 1");
    $stmt->execute([':identifier' => $identifier]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Prepare Token Payload
        $payload = [
            'user_id' => $user['user_id'],
            'username' => $user['username'],
            // exp is automatically calculated inside generate_jwt (defaults to +24hrs)
        ];

        // Generate the base64 HMAC token
        $token = generate_jwt($payload);

        $host = $_SERVER['HTTP_HOST'] ?? '';
        // If there is a port (e.g. localhost:8000), strip it for the cookie domain
        if (strpos($host, ':') !== false) {
            $host = explode(':', $host)[0];
        }

        // Detect if the request is over HTTPS
        $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443 || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https');

        $cookieOptions = [
            'expires' => time() + 86400,
            'path' => '/',
            'domain' => $host, 
            'secure' => $isSecure, 
            'httponly' => true,
            // Safari needs SameSite=None and Secure=true for cross-subdomain/cross-site cookie sharing
            'samesite' => $isSecure ? 'None' : 'Lax' 
        ];
        
        // Use PHP 7.3+ setcookie signature
        setcookie('erp_token', $token, $cookieOptions);

        // Map response (excluding token)
        $responseData = [
            'user' => [
                'id' => $user['user_id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'contact_name' => $user['contact_name'],
                'company_name' => $user['company_name']
            ]
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'เข้าสู่ระบบสำเร็จ', 'data' => $responseData], JSON_UNESCAPED_UNICODE);
        exit();
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง'], JSON_UNESCAPED_UNICODE);
        exit();
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาดจากฐานข้อมูล: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
?>
