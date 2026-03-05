<?php
// backend/api/users/me.php
require_once '../../config/cors.php';
require_once '../../api/users/auth_middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
    exit();
}

// check_auth() will automatically stop execution and return 401 if unauthorized
$userData = check_auth();

http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'User profile retrieved successfully',
    'data' => [
        'user' => $userData
    ]
], JSON_UNESCAPED_UNICODE);
?>
