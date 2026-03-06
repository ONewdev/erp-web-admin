<?php
// admin only
// backend/api/users/get_users.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
require_once '../../config/cors.php';
require_once '../../config/database.php';
require_once '../../utils/response.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method Not Allowed', 405);
}

// Ensure the user is authenticated (Admin session check)
if (!isset($_SESSION['user_id'])) {
    errorResponse('Not authenticated', 401);
}

try {
    $database = new Database();
    $pdo = $database->getConnection();

    // Query Parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? $_GET['limit'] : 20;
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    $startDate = isset($_GET['start_date']) ? $_GET['start_date'] : '';
    $endDate = isset($_GET['end_date']) ? $_GET['end_date'] : '';
    $filterStatus = isset($_GET['status']) ? $_GET['status'] : '';
    
    $offset = 0;
    if ($limit !== 'all') {
        $limit = (int)$limit;
        $offset = ($page - 1) * $limit;
    }

    // Build WHERE clause based on search parameter
    $where = [];
    $params = [];
    if (!empty($search)) {
        $where[] = "(u.username LIKE :search OR u.email LIKE :search OR u.company_name LIKE :search OR u.phone_number LIKE :search OR u.contact_name LIKE :search)";
        $params[':search'] = "%$search%";
    }
    if (!empty($startDate)) {
        $where[] = "DATE(u.created_at) >= :start_date";
        $params[':start_date'] = $startDate;
    }
    if (!empty($endDate)) {
        $where[] = "DATE(u.created_at) <= :end_date";
        $params[':end_date'] = $endDate;
    }
    if (!empty($filterStatus) && $filterStatus !== 'all') {
        $where[] = "u.status = :status";
        $params[':status'] = $filterStatus;
    }
    
    $whereSQL = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    // 1. Get total count for pagination
    $countQuery = "
        SELECT COUNT(DISTINCT u.user_id) as total
        FROM users_erp u
        LEFT JOIN user_product_types upt ON u.user_id = upt.user_id
        LEFT JOIN product_categories pc ON upt.category_id = pc.category_id
        $whereSQL
    ";
    
    $stmtCount = $pdo->prepare($countQuery);
    foreach ($params as $key => $value) {
        $stmtCount->bindValue($key, $value);
    }
    $stmtCount->execute();
    $total = $stmtCount->fetch(PDO::FETCH_ASSOC)['total'];
    $totalPages = ($limit === 'all') ? 1 : ceil($total / (int)$limit);

    // 2. Fetch data with LIMIT and OFFSET
    $query = "
        SELECT 
            u.user_id, u.username, u.email, u.contact_name, u.company_name, 
            u.phone_number, u.address, u.brand_names, u.other_product_details, 
            u.marketing_source, u.marketing_source_detail, u.status, u.created_at,
            GROUP_CONCAT(pc.category_name_th SEPARATOR ', ') as product_categories
        FROM users_erp u
        LEFT JOIN user_product_types upt ON u.user_id = upt.user_id
        LEFT JOIN product_categories pc ON upt.category_id = pc.category_id
        $whereSQL
        GROUP BY u.user_id
        ORDER BY u.created_at DESC";
    
    if ($limit !== 'all') {
        $query .= "\n        LIMIT :limit OFFSET :offset";
    }

    $stmt = $pdo->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    if ($limit !== 'all') {
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    }
    
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Return response with pagination metadata
    successResponse('Users retrieved successfully', [
        'users' => $users,
        'pagination' => [
            'total' => $total,
            'page' => $page,
            'limit' => $limit === 'all' ? $total : $limit,
            'total_pages' => $limit === 'all' ? 1 : $totalPages
        ]
    ]);

} catch (PDOException $e) {
    errorResponse('Database error: ' . $e->getMessage(), 500);
}
?>
