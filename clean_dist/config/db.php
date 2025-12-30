<?php
$host = 'localhost';
$db_name = 'u943695294_mywebsite';
$username = 'u943695294_myuser';
$password = 'Shaikh@#$001';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8");
} catch(PDOException $e) {
    // For production, cleaner error
    echo json_encode(["success" => false, "message" => "Connection Error: " . $e->getMessage()]);
    exit;
}
?>
