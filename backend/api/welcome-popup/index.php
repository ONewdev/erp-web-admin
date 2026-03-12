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

try {
    $query = "SELECT * FROM welcome_popup ORDER BY id DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    successResponse("Welcome popup list", $items);
} catch (Exception $e) {
    errorResponse("Database error: " . $e->getMessage(), 500);
}
?>
