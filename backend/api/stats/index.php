<?php
session_start();
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../utils/response.php';

// Ensure the user is authenticated (Admin session check)
if (!isset($_SESSION['user_id'])) {
    errorResponse('Not authenticated', 401);
}

$database = new Database();
$db = $database->getConnection();

// Optional filters
$range = $_GET['range'] ?? '7'; // days: 7, 30, 90, all
$page_filter = $_GET['page'] ?? ''; // specific page filter

try {
    // 1. Build WHERE clause for date range and page filter
    $where_date = "";
    $where_date_visitors = ""; // For page_daily_visitors table (uses visit_date)
    $params = [];
    $params_visitors = [];
    
    if ($range !== 'all') {
        $days = intval($range);
        $where_date = "WHERE stat_date >= DATE_SUB(CURDATE(), INTERVAL :days DAY)";
        $where_date_visitors = "WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL :days DAY)";
        $params[':days'] = $days;
        $params_visitors[':days'] = $days;
    }

    if (!empty($page_filter)) {
        $where_date .= (empty($where_date) ? "WHERE" : " AND") . " page = :page_filter";
        $where_date_visitors .= (empty($where_date_visitors) ? "WHERE" : " AND") . " page = :page_filter";
        $params[':page_filter'] = $page_filter;
        $params_visitors[':page_filter'] = $page_filter;
    }

    // Total summary: views from page_stats, unique users from page_daily_visitors
    $views_query = "SELECT COALESCE(SUM(view_count), 0) as total_views FROM page_stats $where_date";
    $stmt = $db->prepare($views_query);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->execute();
    $views_result = $stmt->fetch(PDO::FETCH_ASSOC);

    $unique_query = "SELECT COUNT(DISTINCT visitor_id) as total_unique_users FROM page_daily_visitors $where_date_visitors";
    $stmt_u = $db->prepare($unique_query);
    foreach ($params_visitors as $key => $val) {
        $stmt_u->bindValue($key, $val);
    }
    $stmt_u->execute();
    $unique_result = $stmt_u->fetch(PDO::FETCH_ASSOC);

    $summary = [
        'total_views' => $views_result['total_views'],
        'total_unique_users' => $unique_result['total_unique_users'],
    ];

    // 2. Daily trend data (for chart)
    // Views from page_stats
    $trend_views_query = "SELECT stat_date, SUM(view_count) as views
        FROM page_stats $where_date
        GROUP BY stat_date
        ORDER BY stat_date ASC";
    $stmt2 = $db->prepare($trend_views_query);
    foreach ($params as $key => $val) {
        $stmt2->bindValue($key, $val);
    }
    $stmt2->execute();
    $trend_views = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    // Unique users from page_daily_visitors (COUNT DISTINCT per day)
    $trend_unique_query = "SELECT visit_date as stat_date, COUNT(DISTINCT visitor_id) as unique_users
        FROM page_daily_visitors $where_date_visitors
        GROUP BY visit_date
        ORDER BY visit_date ASC";
    $stmt2u = $db->prepare($trend_unique_query);
    foreach ($params_visitors as $key => $val) {
        $stmt2u->bindValue($key, $val);
    }
    $stmt2u->execute();
    $trend_unique = $stmt2u->fetchAll(PDO::FETCH_ASSOC);

    // Merge views and unique into one array keyed by date
    $unique_by_date = [];
    foreach ($trend_unique as $row) {
        $unique_by_date[$row['stat_date']] = $row['unique_users'];
    }
    $daily_trend = [];
    foreach ($trend_views as $row) {
        $daily_trend[] = [
            'stat_date' => $row['stat_date'],
            'views' => $row['views'],
            'unique_users' => $unique_by_date[$row['stat_date']] ?? 0,
        ];
    }

    // 3. Per-page breakdown (top pages)
    $page_query = "SELECT 
        page,
        SUM(view_count) as total_views,
        SUM(unique_user_count) as total_unique_users
        FROM page_stats $where_date
        GROUP BY page
        ORDER BY total_views DESC
        LIMIT 20";
    
    $stmt3 = $db->prepare($page_query);
    foreach ($params as $key => $val) {
        $stmt3->bindValue($key, $val);
    }
    $stmt3->execute();
    $page_breakdown = $stmt3->fetchAll(PDO::FETCH_ASSOC);

    // 4. Device type breakdown
    $device_query = "SELECT 
        device_type,
        SUM(view_count) as total_views,
        SUM(unique_user_count) as total_unique_users
        FROM page_stats $where_date
        GROUP BY device_type
        ORDER BY total_views DESC";
    
    $stmt4 = $db->prepare($device_query);
    foreach ($params as $key => $val) {
        $stmt4->bindValue($key, $val);
    }
    $stmt4->execute();
    $device_breakdown = $stmt4->fetchAll(PDO::FETCH_ASSOC);

    // 5. Today's stats
    $today_views_query = "SELECT COALESCE(SUM(view_count), 0) as today_views FROM page_stats WHERE stat_date = CURDATE()";
    $stmt5 = $db->prepare($today_views_query);
    $stmt5->execute();
    $today_views_result = $stmt5->fetch(PDO::FETCH_ASSOC);

    $today_unique_query = "SELECT COUNT(DISTINCT visitor_id) as today_unique FROM page_daily_visitors WHERE visit_date = CURDATE()";
    $stmt5u = $db->prepare($today_unique_query);
    $stmt5u->execute();
    $today_unique_result = $stmt5u->fetch(PDO::FETCH_ASSOC);

    $today = [
        'today_views' => $today_views_result['today_views'],
        'today_unique' => $today_unique_result['today_unique'],
    ];

    successResponse("Stats fetched successfully", [
        'summary' => $summary,
        'today' => $today,
        'daily_trend' => $daily_trend,
        'page_breakdown' => $page_breakdown,
        'device_breakdown' => $device_breakdown,
    ]);

} catch (Exception $e) {
    errorResponse("Failed to fetch stats: " . $e->getMessage(), 500);
}
?>
