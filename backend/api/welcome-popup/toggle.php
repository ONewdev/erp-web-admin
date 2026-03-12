<?php
error_reporting(0);
ini_set('display_errors', '0');

include_once '../../config/cors.php';
session_start();
include_once '../../config/database.php';
include_once '../../utils/response.php';

if (!isset($_SESSION['user_id'])) {
    errorResponse("Unauthorized", 401);
}

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    if (!isset($data->id)) {
        errorResponse("ID is required");
    }

    $id = $data->id;

    try {
        // Check current status of the target item
        $checkStmt = $db->prepare("SELECT show_status FROM welcome_popup WHERE id = :id");
        $checkStmt->bindParam(":id", $id);
        $checkStmt->execute();
        $item = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if (!$item) {
            errorResponse("Welcome popup not found", 404);
        }

        $currentStatus = (int)$item['show_status'];

        // First, turn off all
        $db->exec("UPDATE welcome_popup SET show_status = 0");

        // If it was off, turn it on. If it was on, leave all off (toggle off).
        if ($currentStatus === 0) {
            $stmt = $db->prepare("UPDATE welcome_popup SET show_status = 1 WHERE id = :id");
            $stmt->bindParam(":id", $id);
            $stmt->execute();
        }

        successResponse("Welcome popup toggled successfully");
    } catch (Exception $e) {
        errorResponse("Database error: " . $e->getMessage(), 500);
    }
} else {
    errorResponse("Method not allowed", 405);
}
?>
