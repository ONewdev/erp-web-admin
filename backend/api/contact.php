<?php
// CORS headers for cross-origin requests
require_once '../config/cors.php';
require_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Fetch latest contact info
    $stmt = $conn->prepare("SELECT * FROM company_info ORDER BY id DESC LIMIT 1");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$result) {
        // Return default values if empty
        echo json_encode([
            "company_name" => "บริษัท บิสซิเนส คอมเพ็ดทิทีฟ อินเทลลิเจนซ์ จำกัด",
            "address" => "59/69 หมู่ 1 ซ.ติวานนท์ - ปากเกร็ด 56 ต.บ้านใหม่ อ.ปากเกร็ด จ.นนทบุรี 11120",
            "sales_phone" => "02-582-2110, 091-762-3838, 086-395-0364",
            "support_phone" => "083-122-6349, 091-762-3838, 086-321-3874",
            "facebook" => "https://www.facebook.com/q.soft/",
            "youtube" => "https://www.youtube.com/user/qsoftthai/",
            "google_maps" => "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21904.272143554408!2d100.56008115037825!3d13.948788647682154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2836299299ac5%3A0xffd24ce376fe4efe!2z4Lia4LiI4LiBLiDguJrguLTguKrguIvguLTguYDguJnguKog4LiE4Lit4Lih4LmA4Lie4LmH4LiU4LiX4Li04LiX4Li14LifIOC4reC4tOC4meC5gOC4l-C4peC4peC4tOC5gOC4iOC4meC4i-C5jA!5e0!3m2!1sth!2sth!4v1768884936985!5m2!1sth!2sth"
        ]);
    } else {
        echo json_encode($result);
    }
} 
else if ($method == 'POST') {
    // Update latest contact info
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (
        !empty($data['company_name']) &&
        !empty($data['address'])
    ) {
        // Get latest row
        $check = $conn->query("SELECT id FROM company_info ORDER BY id DESC LIMIT 1");
        $row = $check->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $sql = "UPDATE company_info SET 
                    company_name = :company_name, 
                    address = :address, 
                    sales_phone = :sales_phone, 
                    support_phone = :support_phone, 
                    facebook = :facebook, 
                    youtube = :youtube, 
                    google_maps = :google_maps 
                    WHERE id = :id";
        } else {
            $sql = "INSERT INTO company_info 
                    (company_name, address, sales_phone, support_phone, facebook, youtube, google_maps) 
                    VALUES 
                    (:company_name, :address, :sales_phone, :support_phone, :facebook, :youtube, :google_maps)";
        }
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':company_name', $data['company_name']);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':sales_phone', $data['sales_phone']);
        $stmt->bindParam(':support_phone', $data['support_phone']);
        $stmt->bindParam(':facebook', $data['facebook']);
        $stmt->bindParam(':youtube', $data['youtube']);
        $stmt->bindParam(':google_maps', $data['google_maps']);
        if ($row) {
            $stmt->bindParam(':id', $row['id']);
        }
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "อัปเดตข้อมูลเรียบร้อยแล้ว"]);
        } else {
            echo json_encode(["success" => false, "message" => "ไม่สามารถอัปเดตข้อมูลได้"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "ข้อมูลไม่ครบถ้วน"]);
    }
}
?>
