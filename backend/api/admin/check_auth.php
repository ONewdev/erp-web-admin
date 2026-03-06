<?php
// check_auth.php
session_start();
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../utils/response.php';

if (isset($_SESSION['user_id'])) {
    try {
        $database = new Database();
        $conn = $database->getConnection();
        
        $stmt = $conn->prepare("SELECT id, username, full_name, last_login FROM admin_users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            successResponse("Authenticated", [
                "user" => $user
            ]);
        } else {
            // User session exists but user not found in DB (e.g. deleted)
            session_destroy();
            errorResponse("User not found", 401);
        }
    } catch (PDOException $e) {
        errorResponse("Database error: " . $e->getMessage(), 500);
    }
} else {
    errorResponse("Not authenticated", 401);
}
?>
