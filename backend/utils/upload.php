<?php
function uploadImage($file) {
    // 1. Define absolute path to uploads directory
    // __DIR__ is backend/utils, so we go up one level to backend, then to uploads
    $targetDir = __DIR__ . '/../uploads/';
    
    // 2. Create directory if not exists
    if (!file_exists($targetDir)) {
        if (!mkdir($targetDir, 0777, true)) {
            throw new Exception("Failed to create upload directory: $targetDir");
        }
    }

    // Check for upload errors
    if (!isset($file['error']) || is_array($file['error'])) {
        throw new Exception('Invalid parameters.');
    }

    switch ($file['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            return null; // No file uploaded, return null (optional field)
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new Exception('File is too large. Server limit exceeded.');
        default:
            throw new Exception('Unknown upload error. Code: ' . $file['error']);
    }

    // Check file size (Increase limit to 20MB for processing)
    if ($file['size'] > 20 * 1024 * 1024) {
        throw new Exception('File is too large. Maximum allowed size is 20MB.');
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    if (!in_array($mimeType, $allowedTypes)) { 
        // Fallback or double check
        if (!in_array($file['type'], $allowedTypes)) {
             throw new Exception("Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.");
        }
        $mimeType = $file['type']; // Use provided type if finfo fails (rare)
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $newFileName = uniqid() . '.' . $extension;
    $targetFilePath = $targetDir . $newFileName;

    if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
        
        // Optimize/Resize Image after upload if it's not a GIF (to preserve formatting/animation)
        // We do this to ensure consistent display and save space.
        // Only attempt if GD extension is available
        if ($mimeType !== 'image/gif' && function_exists('imagecreatefromjpeg')) {
            try {
                resizeImage($targetFilePath, 1920, 85);
            } catch (Exception $e) {
                // If resize fails, keep the original file
                // error_log("Image optimization failed: " . $e->getMessage());
            }
        }

        return "uploads/" . $newFileName;
    } else {
        $error = error_get_last();
        throw new Exception("Failed to move uploaded file. Error: " . ($error['message'] ?? 'Unknown'));
    }
}

/**
 * Resizes an image if it exceeds maxWidth or re-saves it to apply compression.
 */
function resizeImage($filePath, $maxWidth = 1920, $quality = 85) {
    list($width, $height, $type) = getimagesize($filePath);

    // If image is smaller than max width, we might still want to compress it 
    // simply by re-saving, but let's only resize if needed to save processing.
    // Actually, user wants to "compress", so re-saving is good even if dimensions are small.
    // However, let's prioritize dimensions relative to file size.
    
    $newWidth = $width;
    $newHeight = $height;

    // Calculate new dimensions
    if ($width > $maxWidth) {
        $ratio = $maxWidth / $width;
        $newWidth = $maxWidth;
        $newHeight = $height * $ratio;
    }

    // Load image
    switch ($type) {
        case IMAGETYPE_JPEG: $source = imagecreatefromjpeg($filePath); break;
        case IMAGETYPE_PNG: $source = imagecreatefrompng($filePath); break;
        case IMAGETYPE_WEBP: $source = imagecreatefromwebp($filePath); break;
        default: return; // Unsupported for resizing
    }

    if (!$source) return;

    // Create new blank image
    $newImage = imagecreatetruecolor($newWidth, $newHeight);

    // Preserve transparency for PNG/WebP
    if ($type == IMAGETYPE_PNG || $type == IMAGETYPE_WEBP) {
        imagealphablending($newImage, false);
        imagesavealpha($newImage, true);
        $transparent = imagecolorallocatealpha($newImage, 255, 255, 255, 127);
        imagefilledrectangle($newImage, 0, 0, $newWidth, $newHeight, $transparent);
    }

    // Resize
    imagecopyresampled($newImage, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    // Save back to same path
    switch ($type) {
        case IMAGETYPE_JPEG: imagejpeg($newImage, $filePath, $quality); break;
        case IMAGETYPE_PNG: 
            // PNG compression 0-9. 
            imagepng($newImage, $filePath, 6); 
            break;
        case IMAGETYPE_WEBP: imagewebp($newImage, $filePath, $quality); break;
    }

    // Free memory
    imagedestroy($newImage);
    imagedestroy($source);
}
?>
