<?php
// jobs.php
require_once '../config/cors.php';
require_once '../config/database.php';
$database = new Database();
$conn = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' && isset($_POST['_method']) && strtoupper($_POST['_method']) === 'PUT') {
    $method = 'PUT';
}

if ($method == 'GET') {
    try {
        if (isset($_GET['id'])) {
            $stmt = $conn->prepare("SELECT * FROM jobs WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($result);
        } else {
            $stmt = $conn->prepare("SELECT * FROM jobs ORDER BY sort_order ASC, id DESC");
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($results);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} elseif ($method == 'POST') {
    // Add new job
    if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "multipart/form-data") !== false) {
        $data = $_POST;
        if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
            require_once '../utils/upload.php';
            try {
                $data['image'] = uploadImage($_FILES['image']);
            } catch (Exception $e) {
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
                exit;
            }
        } else {
            $data['image'] = $data['image_url'] ?? '';
        }
    } else {
        $data = json_decode(file_get_contents("php://input"), true);
    }

    if (empty($data['title'])) {
        echo json_encode(["success" => false, "message" => "Title is required"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("INSERT INTO jobs (title, positions, description, workType, tags, responsibilities, benefits, qualifications, contact, status, image, is_visible, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['positions'] ?? 1,
            $data['description'] ?? '',
            $data['workType'] ?? '',
            $data['tags'] ?? '',
            $data['responsibilities'] ?? '',
            $data['benefits'] ?? '',
            $data['qualifications'] ?? '',
            $data['contact'] ?? '',
            $data['status'] ?? '',
            $data['image'] ?? '',
            $data['is_visible'] ?? 1,
            $data['sort_order'] ?? 0
        ]);
        
        echo json_encode([
            "success" => true, 
            "message" => "Job added successfully ✅",
            "id" => $conn->lastInsertId()
        ]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} elseif ($method == 'PUT') {
    // Update existing job
    // If it was a POST disguised as PUT, we have $_POST
    if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "multipart/form-data") !== false) {
        $data = $_POST;
        if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
            require_once '../utils/upload.php';
            try {
                $data['image'] = uploadImage($_FILES['image']);
            } catch (Exception $e) {
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
                exit;
            }
        } else {
            $data['image'] = $data['image_url'] ?? $data['image'] ?? '';
        }
    } else {
        $data = json_decode(file_get_contents("php://input"), true);
    }

    if (empty($data['id'])) {
        echo json_encode(["success" => false, "message" => "ID is required for update"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("UPDATE jobs SET title=?, positions=?, description=?, workType=?, tags=?, responsibilities=?, benefits=?, qualifications=?, contact=?, status=?, image=?, is_visible=?, sort_order=? WHERE id=?");
        $stmt->execute([
            $data['title'],
            $data['positions'] ?? 1,
            $data['description'] ?? '',
            $data['workType'] ?? '',
            $data['tags'] ?? '',
            $data['responsibilities'] ?? '',
            $data['benefits'] ?? '',
            $data['qualifications'] ?? '',
            $data['contact'] ?? '',
            $data['status'] ?? '',
            $data['image'] ?? '',
            $data['is_visible'] ?? 1,
            $data['sort_order'] ?? 0,
            $data['id']
        ]);
        
        echo json_encode([
            "success" => true, 
            "message" => "Job updated successfully ✅"
        ]);
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} elseif ($method == 'DELETE') {
    // Delete job
    if (isset($_GET['id'])) {
        try {
            $stmt = $conn->prepare("DELETE FROM jobs WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(["success" => true, "message" => "Job deleted successfully"]);
        } catch (PDOException $e) {
            echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "ID is required for deletion"]);
    }
} elseif ($method == 'OPTIONS') {
    http_response_code(200);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
