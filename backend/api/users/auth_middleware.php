<?php
// backend/api/users/auth_middleware.php
require_once __DIR__ . '/../../utils/jwt.php';

/**
 * Verify authorization token from header and set acting user
 * @return array The decoded user payload
 */
function check_auth() {
    $headers = null;
    
    $token = null;

    // 1. Try to get token from HttpOnly Cookie
    if (isset($_COOKIE['erp_token'])) {
        $token = trim($_COOKIE['erp_token']);
    } 
    // 2. Fallback to Authorization Header (if still used by some clients)
    else {
        // Modern way (if getallheaders() exists)
        if (function_exists('getallheaders')) {
            $allHeaders = getallheaders();
            if (isset($allHeaders['Authorization'])) {
                $headers = trim($allHeaders['Authorization']);
            } elseif (isset($allHeaders['authorization'])) {
                $headers = trim($allHeaders['authorization']);
            }
        }
        
        // Fallback checking via $_SERVER (Nginx / FastCGI)
        if ($headers === null) {
            if (isset($_SERVER['Authorization'])) {
                $headers = trim($_SERVER["Authorization"]);
            } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
                $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
            } elseif (function_exists('apache_request_headers')) {
                $requestHeaders = apache_request_headers();
                $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
                if (isset($requestHeaders['Authorization'])) {
                    $headers = trim($requestHeaders['Authorization']);
                }
            }
        }

        if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            $token = $matches[1];
        }
    }
    
    if (empty($token)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Authorization token missing'], JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    $payload = verify_jwt($token);
    
    if ($payload !== false) {
        return $payload; // Verified successfully
    }
    
    
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Token is invalid or expired'], JSON_UNESCAPED_UNICODE);
    exit();
}
?>
