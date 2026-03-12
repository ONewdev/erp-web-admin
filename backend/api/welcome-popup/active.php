<?php
error_reporting(0);
ini_set('display_errors', '0');

include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

// Public endpoint - no auth required
$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT id, welcome_img FROM welcome_popup WHERE show_status = 1 LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        successResponse("Active welcome popup", $item);
    } else {
        successResponse("No active welcome popup", null);
    }
} catch (Exception $e) {
    errorResponse("Database error: " . $e->getMessage(), 500);
}
?>
