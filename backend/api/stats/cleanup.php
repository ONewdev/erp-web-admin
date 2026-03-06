<?php
session_start();
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

// Ensure the user is authenticated (Admin session check)
if (!isset($_SESSION['user_id'])) {
    errorResponse('Not authenticated', 401);
}

// Enforce POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse("Method not allowed", 405);
}

$input = json_decode(file_get_contents("php://input"), true);

// Default: delete records older than 30 days
$days = isset($input['days']) ? intval($input['days']) : 30;

if ($days < 1) {
    errorResponse("Days must be at least 1");
}

$database = new Database();
$db = $database->getConnection();

try {
    // Count records to be deleted
    $count_query = "SELECT COUNT(*) as total FROM page_daily_visitors WHERE visit_date < DATE_SUB(CURDATE(), INTERVAL :days DAY)";
    $stmt_count = $db->prepare($count_query);
    $stmt_count->bindParam(":days", $days, PDO::PARAM_INT);
    $stmt_count->execute();
    $count_result = $stmt_count->fetch(PDO::FETCH_ASSOC);
    $deleted_count = $count_result['total'];

    // Delete old records
    $query = "DELETE FROM page_daily_visitors WHERE visit_date < DATE_SUB(CURDATE(), INTERVAL :days DAY)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":days", $days, PDO::PARAM_INT);

    if ($stmt->execute()) {
        successResponse("Deleted visitor logs older than $days days", [
            'deleted_count' => $deleted_count,
            'days' => $days,
        ]);
    } else {
        errorResponse("Failed to delete logs", 500);
    }
} catch (Exception $e) {
    errorResponse("Database error: " . $e->getMessage(), 500);
}
?>
