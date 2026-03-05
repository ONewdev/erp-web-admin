<?php
// config.php

// ================= CORS & Header =================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY");
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS preflight early — before DB connection
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ================= Load .env file =================
function loadEnv($path) {
    if (!file_exists($path)) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            putenv(trim($parts[0]) . "=" . trim($parts[1]));
            $_ENV[trim($parts[0])] = trim($parts[1]);
        }
    }
}
loadEnv(__DIR__ . '/.env');

// ================= Database Config =================
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'bci_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: 'root');

try {
    $conn = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
        DB_USER,
        DB_PASS
    );
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");
} catch (PDOException $exception) {
    echo json_encode([
        "error" => "Connection error: " . $exception->getMessage()
    ]);
    exit;
}