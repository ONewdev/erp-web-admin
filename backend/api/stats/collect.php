<?php

include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

// Enforce POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse("Method not allowed", 405);
}

// Get JSON input
$input = json_decode(file_get_contents("php://input"), true);

$page = $input['page'] ?? '';
$device_type = $input['device_type'] ?? 'unknown';
$visitor_id = $input['visitor_id'] ?? ''; // New: Unique visitor ID

// Validation: Page
if (empty($page)) {
    errorResponse("Page identifier is required");
}

if (strlen($page) > 255) {
    errorResponse("Page identifier is too long (max 255)");
}

// Validation: Device Type
$allowed_devices = ['desktop', 'tablet', 'mobile', 'unknown'];
if (!in_array($device_type, $allowed_devices)) {
    $device_type = 'unknown'; 
}

$database = new Database();
$db = $database->getConnection();

try {
    // Current UTC date
    $stat_date = gmdate('Y-m-d');
    $is_unique = false;

    // 1. Try to record unique visit in daily log
    if (!empty($visitor_id)) {
        try {
            $check_sql = "INSERT IGNORE INTO page_daily_visitors (page, visitor_id, visit_date, device_type) VALUES (:page, :visitor_id, :stat_date, :device_type)";
            $stmt_check = $db->prepare($check_sql);
            $stmt_check->bindParam(":page", $page);
            $stmt_check->bindParam(":visitor_id", $visitor_id);
            $stmt_check->bindParam(":stat_date", $stat_date);
            $stmt_check->bindParam(":device_type", $device_type);
            $stmt_check->execute();
            
            // If row inserted, it's a new unique visit for today
            if ($stmt_check->rowCount() > 0) {
                $is_unique = true;
            }
        } catch (Exception $e) {
            // Ignore error, treat as not unique if check fails
        }
    }

    // 2. Upsert Stats (Always increment view_count, increment unique_user_count if active)
    $increment_unique = $is_unique ? 1 : 0;

    $query = "INSERT INTO page_stats (page, stat_date, device_type, view_count, unique_user_count, created_at) 
              VALUES (:page, :stat_date, :device_type, 1, :unique_increment, NOW()) 
              ON DUPLICATE KEY UPDATE 
                view_count = view_count + 1,
                unique_user_count = unique_user_count + :unique_increment_update";
    
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(":page", $page);
    $stmt->bindParam(":stat_date", $stat_date);
    $stmt->bindParam(":device_type", $device_type);
    $stmt->bindParam(":unique_increment", $increment_unique);
    $stmt->bindParam(":unique_increment_update", $increment_unique);
    
    if ($stmt->execute()) {
        successResponse("Statistics recorded successfully. Unique: " . ($is_unique ? 'Yes' : 'No'));
    } else {
        errorResponse("Failed to record statistics", 500);
    }
} catch (Exception $e) {
    errorResponse("Database error: " . $e->getMessage(), 500);
}
?>
