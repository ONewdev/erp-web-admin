<?php
error_reporting(0);
ini_set('display_errors', '0');
header('Content-Type: application/json');

// Catch any PHP errors/warnings that might output HTML
ob_start();
register_shutdown_function(function() {
    $error = error_get_last();
    $output = ob_get_clean();
    // If there's unexpected output (like PHP HTML errors), return as JSON error
    if ($output && strpos($output, '<') !== false && !headers_sent()) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Server error occurred during upload',
            'data' => null
        ]);
        exit;
    } elseif ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (!headers_sent()) {
            http_response_code(500);
        }
        echo json_encode([
            'status' => 'error',
            'message' => 'Internal server error: ' . $error['message'],
            'data' => null
        ]);
        exit;
    }
    // Normal output - just echo it
    echo $output;
});

include_once '../../config/cors.php';
session_start();
include_once '../../config/database.php';
include_once '../../utils/response.php';
include_once '../../utils/upload.php';

if (!isset($_SESSION['user_id'])) {
    errorResponse("Unauthorized", 401);
}

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if POST is empty but content length is > 0 (Limit exceeded)
    if (empty($_POST) && empty($_FILES) && isset($_SERVER['CONTENT_LENGTH']) && $_SERVER['CONTENT_LENGTH'] > 0) {
        errorResponse("File is too large. Server POST limit exceeded.", 413);
    }

    if (!isset($_FILES['image'])) {
        errorResponse("Image is required");
    }

    // Handle Image Upload
    $imagePath = null;
    try {
        $imagePath = uploadImage($_FILES['image']);
    } catch (Exception $e) {
        errorResponse($e->getMessage());
    }

    if (!$imagePath) {
        errorResponse("Failed to upload image");
    }

    try {
        $query = "INSERT INTO welcome_popup (welcome_img, show_status, created_at) VALUES (:welcome_img, 0, NOW())";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":welcome_img", $imagePath);

        if ($stmt->execute()) {
            successResponse("Welcome popup created successfully", [
                'id' => $db->lastInsertId(),
                'welcome_img' => $imagePath
            ]);
        } else {
            errorResponse("Failed to create welcome popup", 500);
        }
    } catch (Exception $e) {
        errorResponse("Database error: " . $e->getMessage(), 500);
    }
} else {
    errorResponse("Method not allowed", 405);
}
?>
