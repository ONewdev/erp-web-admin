<?php
// powerbi.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['action']) && $_GET['action'] == 'count') {
        try {
            $stmt = $conn->query("SELECT COUNT(*) as total FROM bi_registrations");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(["success" => true, "count" => $result['total']]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
        }
        exit;
    }

    // Fetch all Power BI registrations
    try {
        $stmt = $conn->prepare("SELECT * FROM bi_registrations ORDER BY created_at DESC");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} elseif ($method == 'POST') {
    // Insert new registration
    $data = json_decode(file_get_contents("php://input"), true);

    if (empty($data['name']) || empty($data['mobile']) || empty($data['company'])) {
        echo json_encode(["success" => false, "message" => "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน"]);
        exit;
    }

    try {
        // Generate ID_CODE (e.g., BR-001 for BI Registration)
        $stmt_check = $conn->query("SELECT MAX(id) as max_id FROM bi_registrations");
        $row = $stmt_check->fetch(PDO::FETCH_ASSOC);
        $next_id = ($row['max_id'] ?? 0) + 1;
        $id_code = "BR-" . str_pad($next_id, 3, "0", STR_PAD_LEFT);

        $stmt = $conn->prepare("INSERT INTO bi_registrations (id_code, name, email, mobile, company, address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $id_code,
            $data['name'],
            $data['email'] ?? '',
            $data['mobile'],
            $data['company'],
            $data['address'] ?? ''
        ]);
        
        echo json_encode([
            "success" => true, 
            "message" => "ลงทะเบียนเรียบร้อยแล้ว ✅", 
            "id_code" => $id_code
        ]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} elseif ($method == 'OPTIONS') {
    // Handle preflight requests
    http_response_code(200);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
