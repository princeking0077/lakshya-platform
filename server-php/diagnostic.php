<?php
// diagnostic.php
// Standalone Diagnostic Tool for Enlighten Pharma
header('Content-Type: text/plain'); // Return plain text for easy reading

echo "=== ENLIGHTEN PHARMA DIAGNOSTIC TOOL ===\n";
echo "Generated: " . date('Y-m-d H:i:s') . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "\n";

echo "\n----------------------------------------\n";
echo "[1] CHECKING CONFIGURATION FILE\n";
$configPath = 'config/db.php';
if (file_exists($configPath)) {
    echo "✅ config/db.php found.\n";
    
    // Check if file is readable
    if (is_readable($configPath)) {
        echo "✅ config/db.php is readable.\n";
    } else {
        echo "❌ config/db.php exists but is NOT readable (Permission Error).\n";
    }
} else {
    echo "❌ config/db.php NOT FOUND.\n";
    echo "   Ensure you have uploaded the 'config' folder.\n";
}

echo "\n----------------------------------------\n";
echo "[2] CHECKING DATABASE CONNECTION\n";

if (file_exists($configPath)) {
    try {
        require_once $configPath;
        if (isset($conn) && $conn instanceof PDO) {
            echo "✅ \$conn object created successfully.\n";
            
            // Test actual query
            $stmt = $conn->query("SELECT DATABASE()");
            $dbName = $stmt->fetchColumn();
            echo "✅ Connected to Database: '$dbName'\n";
            
            // Test Users Table
            $stmt = $conn->query("SELECT COUNT(*) FROM users");
            $userCount = $stmt->fetchColumn();
            echo "✅ Table 'users' exists. Found $userCount users.\n";
            
        } else {
            echo "❌ Database Connected but \$conn variable is missing.\n";
        }
    } catch (PDOException $e) {
        echo "❌ Database Error: " . $e->getMessage() . "\n";
        echo "   Check your username, password, and database name in config/db.php.\n";
    } catch (Exception $e) {
        echo "❌ General Error: " . $e->getMessage() . "\n";
    }
} else {
    echo "⚠️ Skipping DB check because config file is missing.\n";
}

echo "\n----------------------------------------\n";
echo "[3] CHECKING FILE STRUCTURE\n";

$dirs = [
    'api/users' => 'Users API',
    'api/courses' => 'Courses API',
    'admin' => 'Admin Panel'
];

foreach ($dirs as $path => $name) {
    if (is_dir($path)) {
        echo "✅ $name Folder ($path) exists.\n";
        // Check index.php
        if (file_exists("$path/index.php")) {
             echo "   ✅ index.php found.\n";
        } elseif ($path === 'admin') {
             // Admin might be static HTML
             if (file_exists("$path/index.html") || file_exists("$path/index.txt")) {
                 echo "   ✅ index.html found.\n";
             }
        } else {
             echo "   ❌ index.php MISSING in $path.\n";
        }
    } else {
        echo "❌ $name Folder ($path) MISSING.\n";
    }
}

echo "\n----------------------------------------\n";
echo "[4] CHECKING .htaccess (Server Rules)\n";
if (file_exists('.htaccess')) {
    echo "✅ .htaccess file exists.\n";
    $content = file_get_contents('.htaccess');
    if (strpos($content, 'RewriteEngine On') !== false) {
         echo "   ✅ Contains RewriteEngine On.\n";
    } else {
         echo "   ⚠️ .htaccess exists but might be empty or invalid.\n";
    }
} else {
    echo "❌ .htaccess file MISSING. (Required for API routing)\n";
}

echo "\n=== END OF DIAGNOSTIC REPORT ===\n";
?>
