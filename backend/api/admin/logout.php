<?php
// logout.php
session_start();
require_once '../../config/cors.php';
require_once '../../utils/response.php';

session_unset();
session_destroy();

// Clear session cookie from browser
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

successResponse("Logged out successfully");
?>
