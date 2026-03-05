<?php
// backend/config/cors.php

// Load .env if not already loaded
if (!function_exists('loadEnvCors')) {
    function loadEnvCors($path) {
        if (!file_exists($path)) {
            return;
        }
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);
            if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
                $_SERVER[$name] = $value;
            }
        }
    }
}

loadEnvCors(__DIR__ . '/../.env');

$env = getenv('env') ?: 'dev';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    if ($env === 'prod') {
        // Allow q-softthai.com and its subdomains
        if (preg_match('/^https?:\/\/([a-z0-9-]+\.)*erptothai\.com$/', $origin)) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');
        } else {
            // Optional: Handle unauthorized origins (or just don't send headers)
            // For now, we don't send Access-Control-Allow-Origin, blocking the request
        }
    } else {
        // DEV: Allow everything (or specific localhost)
        header("Access-Control-Allow-Origin: $origin");
         header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
} else {
    // No Origin header (e.g. server-to-server or direct browser navigation)
    // You might checking hardcoded allowed origins here if needed, but usually not for CORS
     if ($env !== 'prod') {
         header("Access-Control-Allow-Origin: http://localhost:3000, http://localhost:3001");
         header('Access-Control-Allow-Credentials: true');
         header('Access-Control-Max-Age: 86400');    // cache for 1 day
     }
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    else
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    exit(0);
}
?>
