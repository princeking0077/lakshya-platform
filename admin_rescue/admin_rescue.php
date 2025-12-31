<?php
// START: CONFIGURATION
$adminEmail = "admin@example.com";
$adminPassword = "admin123"; // This password will be hashed
$adminName = "Super Admin";
// END CONFIGURATION


require_once 'cors.php';
require_once 'config/db.php';

try {
    // 1. Check if user already exists
    $checkQ = "SELECT id FROM users WHERE email = :email";
    $stmt = $conn->prepare($checkQ);
    $stmt->bindParam(':email', $adminEmail);
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $user['id'];
        
        // Update password
        $hash = password_hash($adminPassword, PASSWORD_DEFAULT);
        $updQ = "UPDATE users SET password = :pass, role = 'admin' WHERE id = :id";
        $updStmt = $conn->prepare($updQ);
        $updStmt->bindParam(':pass', $hash);
        $updStmt->bindParam(':id', $id);
        $updStmt->execute();
        
        echo "<h1 style='color: green'>✅ Admin Updated!</h1>";
        echo "<p>User <b>$adminEmail</b> password has been reset to: <b>$adminPassword</b></p>";
    } else {
        // Create new Admin
        $hash = password_hash($adminPassword, PASSWORD_DEFAULT);
        $insQ = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :pass, 'admin')";
        $insStmt = $conn->prepare($insQ);
        $insStmt->bindParam(':name', $adminName);
        $insStmt->bindParam(':email', $adminEmail);
        $insStmt->bindParam(':pass', $hash);
        $insStmt->execute();
        
        echo "<h1 style='color: green'>✅ Admin Created!</h1>";
        echo "<p>User <b>$adminEmail</b> has been created with password: <b>$adminPassword</b></p>";
    }
    
} catch(PDOException $e) {
    echo "<h1 style='color: red'>❌ Error</h1>";
    echo $e->getMessage();
}
?>
