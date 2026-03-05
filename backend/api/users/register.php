<?php
require_once '../../config/cors.php';
require_once '../../config/database.php';

$database = new Database();
$pdo = $database->getConnection();

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON payload']);
    exit();
}

// 1. Input Validation
$username = trim($data->username ?? '');
$password = $data->password ?? '';
$contactName = trim($data->contactName ?? '');
$companyName = trim($data->companyName ?? '');
$address = trim($data->address ?? '');
$phoneNumber = trim($data->phoneNumber ?? '');
$email = trim($data->email ?? '');
$brandName = trim($data->brandName ?? '');
$productTypeIds = $data->productTypeIds ?? [];
$otherProductType = trim($data->otherProductType ?? '');
$selectedMarketingChannels = $data->selectedMarketingChannels ?? [];
$marketingDetails = $data->marketingDetails ?? new stdClass();

// Basic empty checks
if (empty($username) || empty($password) || empty($email) || empty($contactName) || empty($companyName) || empty($address)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน'], JSON_UNESCAPED_UNICODE);
    exit();
}

// Email format validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'รูปแบบอีเมลไม่ถูกต้อง'], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    // 2. Uniqueness Check (Username and Email)
    $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM users_qsoft WHERE username = :username OR email = :email");
    $stmtCheck->execute([
        ':username' => $username,
        ':email' => $email
    ]);
    if ($stmtCheck->fetchColumn() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(['status' => 'error', 'message' => 'ชื่อผู้ใช้ หรือ อีเมลนี้ มีในระบบแล้ว'], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // 3. Data Preparation
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $marketingSourceJson = json_encode($selectedMarketingChannels, JSON_UNESCAPED_UNICODE);
    $marketingDetailJson = json_encode($marketingDetails, JSON_UNESCAPED_UNICODE);

    // 4. Transaction Start
    $pdo->beginTransaction();

    // 5. Insert into users_qsoft
    $sqlUser = "INSERT INTO users_qsoft 
                (username, password_hash, contact_name, company_name, address, phone_number, email, brand_names, other_product_details, marketing_source, marketing_source_detail) 
                VALUES 
                (:username, :password_hash, :contact_name, :company_name, :address, :phone_number, :email, :brand_names, :other_product_details, :marketing_source, :marketing_source_detail)";
    
    $stmtUser = $pdo->prepare($sqlUser);
    $stmtUser->execute([
        ':username' => $username,
        ':password_hash' => $passwordHash,
        ':contact_name' => $contactName,
        ':company_name' => $companyName,
        ':address' => $address,
        ':phone_number' => $phoneNumber,
        ':email' => $email,
        ':brand_names' => $brandName,
        ':other_product_details' => $otherProductType,
        ':marketing_source' => $marketingSourceJson,
        ':marketing_source_detail' => $marketingDetailJson
    ]);

    $userId = $pdo->lastInsertId();

    // 6. Insert into user_product_types
    if (is_array($productTypeIds) && count($productTypeIds) > 0) {
        $sqlProduct = "INSERT INTO user_product_types (user_id, category_id) VALUES (:user_id, :category_id)";
        $stmtProduct = $pdo->prepare($sqlProduct);

        foreach ($productTypeIds as $categoryId) {
            // Only insert numeric IDs as per requirement
            if (is_numeric($categoryId)) {
                $stmtProduct->execute([
                    ':user_id' => $userId,
                    ':category_id' => (int)$categoryId
                ]);
            }
        }
    }

    // 7. Transaction Commit
    $pdo->commit();

    http_response_code(201); // Created
    echo json_encode(['status' => 'success', 'message' => 'สมัครสมาชิกสำเร็จ'], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    // 8. Error Handling & Rollback
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
