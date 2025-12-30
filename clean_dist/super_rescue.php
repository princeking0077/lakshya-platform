<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<style>body{font-family:sans-serif;line-height:1.5;padding:20px;max-width:800px;margin:0 auto;}</style>";
echo "<h1>🕵️ File System Detective</h1>";

// 1. SHOW CURRENT FILES
echo "<h3>📂 Current Folder Contents (" . __DIR__ . "):</h3>";
$files = scandir(__DIR__);
echo "<ul>";
foreach ($files as $file) {
    if($file == '.' || $file == '..') continue;
    $type = is_dir($file) ? "[DIR]" : "[FILE]";
    $style = is_dir($file) ? "color:blue;font-weight:bold" : "color:black";
    echo "<li><span style='$style'>$type $file</span></li>";
}
echo "</ul>";

// 2. LOCATE DB.PHP
$possible_paths = [
    'config/db.php', 
    'api/config/db.php',
    'server-php/config/db.php',  // Common unzip mistake
    '../config/db.php'
];

$found_db = false;
foreach($possible_paths as $path) {
    if(file_exists($path)) {
        echo "<h2 style='color:green'>✅ Found Database Config at: $path</h2>";
        require_once $path;
        $found_db = true;
        break;
    }
}

if(!$found_db) {
    echo "<h2 style='color:red'>❌ MISSING: config/db.php</h2>";
    echo "<p>I checked these locations and found nothing:</p><ul>";
    foreach($possible_paths as $p) echo "<li>$p</li>";
    echo "</ul>";
    echo "<div style='background:#fee;padding:15px;border:1px solid red;border-radius:5px;'>";
    echo "<h3>repair: Create config/db.php?</h3>";
    echo "<p>If you deleted it, I can create a default one. Use File Manager to edit the password later.</p>";
    // Form to create it
    echo '<form method="POST">
        <input type="hidden" name="create_db" value="1">
        <button style="font-size:18px;padding:10px;cursor:pointer;">🛠️ Create Default DB Config</button>
    </form>';
    echo "</div>";
    
    if(isset($_POST['create_db'])) {
        if(!is_dir('config')) mkdir('config');
        $content = '<?php
$host = "localhost";
$db_name = "u943695294_mywebsite"; // Check Hostinger for real name
$username = "u943695294_myuser";   // Check Hostinger for real name
$password = "ENTER_PASSWORD_HERE"; // EDIT THIS FILE!
try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8");
} catch(PDOException $e) { echo "DB Connection Failed: " . $e->getMessage(); exit; }
?>';
        file_put_contents('config/db.php', $content);
        echo "<script>window.location.reload();</script>";
    }
    exit; // Stop here if no DB
}

// 3. ADMIN RESET (Only if DB found)
echo "<h3>🔑 Admin Account Status</h3>";
if(isset($conn)) {
    try {
        $stmt = $conn->query("SELECT id, email, role FROM users WHERE role='admin' LIMIT 1");
        if($stmt->rowCount() > 0) {
            $u = $stmt->fetch(PDO::FETCH_ASSOC);
            echo "<p style='color:green'>✅ Admin Exists: <b>{$u['email']}</b></p>";
        } else {
             // Create Default
             $pass = password_hash("admin123", PASSWORD_DEFAULT);
             $conn->exec("INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@example.com', '$pass', 'admin')");
             echo "<p style='color:green'>✅ Created user: admin@example.com / admin123</p>";
        }
    } catch(Exception $e) {
        echo "<p style='color:red'>DB Connection Error (Check config/db.php password): " . $e->getMessage() . "</p>";
    }
}
?>
