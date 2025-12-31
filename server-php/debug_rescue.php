<?php
// ENABLE ERROR REPORTING
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Debug Info</h1>";
echo "<p>Checking files...</p>";

if (file_exists('cors.php')) {
    echo "<p style='color:green'>✅ cors.php found</p>";
    require_once 'cors.php';
} else {
    echo "<p style='color:red'>❌ cors.php NOT found in " . __DIR__ . "</p>";
}

if (file_exists('config/db.php')) {
    echo "<p style='color:green'>✅ config/db.php found</p>";
    require_once 'config/db.php';
} else {
    echo "<p style='color:red'>❌ config/db.php NOT found in " . __DIR__ . "/config</p>";
}

echo "<p>Files loaded. Attempting Database Connection...</p>";

try {
    // START: CONFIGURATION
    $adminEmail = "admin@example.com";
    $adminPassword = "admin123";
    $adminName = "Super Admin";

    // Re-verify connection explicitly
    if(!isset($conn)) {
        throw new Exception("Database connection variable \$conn is not set. Check config/db.php");
    }
    
    echo "<p style='color:green'>✅ Database Connected!</p>";

    // 1. Check if user already exists
    $checkQ = "SELECT id FROM users WHERE email = :email";
    $stmt = $conn->prepare($checkQ);
    $stmt->bindParam(':email', $adminEmail);
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $user['id'];
        
        $hash = password_hash($adminPassword, PASSWORD_DEFAULT);
        $updQ = "UPDATE users SET password = :pass, role = 'admin' WHERE id = :id";
        $updStmt = $conn->prepare($updQ);
        $updStmt->bindParam(':pass', $hash);
        $updStmt->bindParam(':id', $id);
        $updStmt->execute();
        
        echo "<h1 style='color: green'>✅ Admin Updated!</h1>";
    } else {
        $hash = password_hash($adminPassword, PASSWORD_DEFAULT);
        $insQ = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :pass, 'admin')";
        $insStmt = $conn->prepare($insQ);
        $insStmt->bindParam(':name', $adminName);
        $insStmt->bindParam(':email', $adminEmail);
        $insStmt->bindParam(':pass', $hash);
        $insStmt->execute();
        
        echo "<h1 style='color: green'>✅ Admin Created!</h1>";
    }
    
} catch(Exception $e) {
    echo "<h1 style='color: red'>❌ Critical Error</h1>";
    echo "<pre>" . $e->getMessage() . "</pre>";
    // Print DB Config (Masked password)
    include 'config/db.php';
    echo "<p><b>DB User:</b> $username</p>";
    echo "<p><b>DB Name:</b> $db_name</p>";
}
?>
