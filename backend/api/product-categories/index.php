<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Fetch Data
    $query = "SELECT category_id, category_name, category_name_th FROM product_categories ORDER BY category_id ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    successResponse("Product categories fetched successfully", $categories);
} catch (Exception $e) {
    errorResponse("Failed to fetch product categories: " . $e->getMessage(), 500);
}
?>
