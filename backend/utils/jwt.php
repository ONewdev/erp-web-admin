<?php
// backend/utils/jwt.php
require_once __DIR__ . '/../config/app.php';

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

/**
 * Generate a JWT token
 * @param array $payload Data to embed in the token
 * @param int $expirySeconds Default 24 hours
 * @return string The signed JWT token
 */
function generate_jwt($payload, $expirySeconds = 86400) {
    $secret = getAppSecret();
    
    // Header
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    
    // Add Expiration if not present
    if (!isset($payload['exp'])) {
        $payload['exp'] = time() + $expirySeconds;
    }
    
    $payloadJson = json_encode($payload, JSON_UNESCAPED_UNICODE);
    
    // Base64Url Encode
    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode($payloadJson);
    
    // Signature
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64url_encode($signature);
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

/**
 * Verify a JWT token
 * @param string $token The JWT string
 * @return array|false Returns the payload array if valid, false if invalid or expired
 */
function verify_jwt($token) {
    $secret = getAppSecret();
    
    $tokenParts = explode('.', $token);
    if (count($tokenParts) != 3) {
        return false;
    }
    
    $header = base64url_decode($tokenParts[0]);
    $payload = base64url_decode($tokenParts[1]);
    $signatureProvided = $tokenParts[2];
    
    // Check the signature
    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode($payload);
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64url_encode($signature);
    
    if (!hash_equals($base64UrlSignature, $signatureProvided)) {
        return false; // Signature mismatch
    }
    
    $payloadArray = json_decode($payload, true);
    
    // Check expiration
    if (isset($payloadArray['exp']) && $payloadArray['exp'] < time()) {
        return false; // Token expired
    }
    
    return $payloadArray;
}
?>
