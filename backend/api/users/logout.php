<?php
// backend/api/users/logout.php
require_once '../../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
    exit();
}

// Clear the HttpOnly Cookie by setting expiration time to the past
$host = $_SERVER['HTTP_HOST'] ?? '';
if (strpos($host, ':') !== false) {
    $host = explode(':', $host)[0];
}

$isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443 || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https');

$cookieOptions = [
    'expires' => time() - 3600,
    'path' => '/',
    'domain' => $host, 
    'secure' => $isSecure, 
    'httponly' => true,
    'samesite' => $isSecure ? 'None' : 'Lax'
];

if (PHP_VERSION_ID >= 70300) {
    // 1. With domain
    setcookie('erp_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'domain' => $host,
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => $isSecure ? 'None' : 'Lax'
    ]);
    // 2. Without domain
    setcookie('erp_token', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'domain' => '',
        'secure' => $isSecure,
        'httponly' => true,
        'samesite' => $isSecure ? 'None' : 'Lax'
    ]);
} else {
    setcookie('erp_token', '', time() - 3600, '/', $host, $isSecure, true);
    setcookie('erp_token', '', time() - 3600, '/', '', $isSecure, true);
}

// Fallback: manually force headers
$pastDate = gmdate('D, d M Y H:i:s T', time() - 86400 * 30);
$cookieString = "erp_token=; expires={$pastDate}; path=/; HttpOnly";
if ($isSecure) {
    $cookieString .= "; Secure; SameSite=None";
} else {
    $cookieString .= "; SameSite=Lax";
}
header('Set-Cookie: ' . $cookieString . '; domain=' . $host, false);
header('Set-Cookie: ' . $cookieString, false); 

if (isset($_COOKIE['erp_token'])) {
    unset($_COOKIE['erp_token']);
}

http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Logout successful'
], JSON_UNESCAPED_UNICODE);
?>
