<?php
function jsonResponse($status, $message, $data = null, $code = 200) {
    header('Content-Type: application/json');
    http_response_code($code);
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

function errorResponse($message, $code = 400) {
    jsonResponse('error', $message, null, $code);
}

function successResponse($message, $data = null) {
    jsonResponse('success', $message, $data, 200);
}
?>
