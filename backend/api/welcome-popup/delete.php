<?php
error_reporting(0);
ini_set('display_errors', '0');

session_start();
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

if (!isset($_SESSION['user_id'])) {
    errorResponse("Unauthorized", 401);
}

$database = new Database();
$db = $database->getConnection();

$id = null;

// Check query param
if (isset($_GET['id'])) {
    $id = $_GET['id'];
} else {
    // Check JSON body
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->id)) {
        $id = $data->id;
    }
}

if (!empty($id)) {
    try {
        // Fetch image path to delete the file
        $fetchStmt = $db->prepare("SELECT welcome_img FROM welcome_popup WHERE id = :id");
        $fetchStmt->bindParam(":id", $id);
        $fetchStmt->execute();
        $item = $fetchStmt->fetch(PDO::FETCH_ASSOC);

        if ($item && !empty($item['welcome_img'])) {
            $filePath = __DIR__ . '/../../' . $item['welcome_img'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $query = "DELETE FROM welcome_popup WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
                successResponse("Welcome popup deleted successfully");
            } else {
                errorResponse("Welcome popup not found", 404);
            }
        } else {
            errorResponse("Failed to delete welcome popup", 500);
        }
    } catch (Exception $e) {
        errorResponse("Database error: " . $e->getMessage(), 500);
    }
} else {
    errorResponse("ID is required", 400);
}
?>
