<?php
// messages.php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    // ---- Saving a new message (From Public Site) ----
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (
        !empty($data['name']) && 
        !empty($data['phone']) && 
        !empty($data['email']) && 
        !empty($data['company'])
    ) {
        $sql = "INSERT INTO contact_messages (name, phone, email, company, service) 
                VALUES (:name, :phone, :email, :company, :service)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':phone', $data['phone']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':company', $data['company']);
        $stmt->bindParam(':service', $data['service']);
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "ส่งข้อมูลเรียบร้อยแล้ว ✅"]);
        } else {
            echo json_encode(["success" => false, "message" => "ไม่สามารถบันทึกข้อมูลได้"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "ข้อมูลไม่ครบถ้วน"]);
    }
} 
else if ($method == 'GET') {
    // ---- Fetching all messages (For Admin Site) ----
    $sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($messages);
}
?>
