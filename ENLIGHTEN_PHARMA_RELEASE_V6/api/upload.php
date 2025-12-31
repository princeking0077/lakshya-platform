<?php
require_once '../cors.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
    $target_dir = "../uploads/"; // Parent directory uploads folder
    
    // Create dir if not exists
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $file_extension = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
    $new_filename = uniqid() . '.' . $file_extension;
    $target_file = $target_dir . $new_filename;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
        // Return relative URL for frontend
        $url = "/uploads/" . $new_filename;
        echo json_encode(["success" => true, "data" => $url]);
    } else {
        echo json_encode(["success" => false, "message" => "Upload failed"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No file provided"]);
}
?>
