<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CONFIG
$configFile = 'config/db.php';
$sqlFile = 'database.sql';

// STEPS
$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;
$error = '';
$success = '';

// --- HELPER FUNCTIONS ---
function check_requirement($name, $status) {
    $icon = $status ? '✅' : '❌';
    $color = $status ? 'green' : 'red';
    echo "<div style='margin-bottom:5px; color:$color'>$icon <b>$name</b></div>";
    return $status;
}

// --- LOGIC ---

// STEP 2 SUBMIT: DB CONNECTION
if ($step == 2 && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $host = $_POST['host'];
    $user = $_POST['user'];
    $pass = $_POST['pass'];
    $name = $_POST['name'];

    try {
        $conn = new mysqli($host, $user, $pass, $name);
        if ($conn->connect_error) {
            throw new Exception("Connection Failed: " . $conn->connect_error);
        }
        
        // Save to session
        $_SESSION['db'] = [
            'host' => $host,
            'user' => $user,
            'pass' => $pass,
            'name' => $name
        ];
        
        // Redirect
        header("Location: install.php?step=3");
        exit;
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

// STEP 3 SUBMIT: ADMIN & INSTALL
if ($step == 3 && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $adminEmail = $_POST['email'];
    $adminPass = $_POST['password'];
    $db = $_SESSION['db'];

    try {
        // 1. Connect
        $conn = new PDO("mysql:host={$db['host']};dbname={$db['name']}", $db['user'], $db['pass']);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // 2. Pre-Installation: Clean Slate if requested
        if (isset($_POST['clean_install']) && $_POST['clean_install'] == '1') {
            $tables = ['results', 'questions', 'course_materials', 'tests', 'courses', 'users'];
            $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
            foreach ($tables as $table) {
                $conn->exec("DROP TABLE IF EXISTS $table");
            }
            $conn->exec("SET FOREIGN_KEY_CHECKS = 1");
        }

        // 3. Import SQL
        if (!file_exists($sqlFile)) throw new Exception("database.sql file not found!");
        $sql = file_get_contents($sqlFile);
        $conn->exec($sql);

        // 3. Create Admin
        $hash = password_hash($adminPass, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES ('Super Admin', :email, :pass, 'admin')");
        $stmt->execute([':email' => $adminEmail, ':pass' => $hash]);

        // 4. Create Config File
        $configContent = "<?php\n";
        $configContent .= "\$host = '{$db['host']}';\n";
        $configContent .= "\$db_name = '{$db['name']}';\n";
        $configContent .= "\$username = '{$db['user']}';\n";
        $configContent .= "\$password = '{$db['pass']}';\n";
        $configContent .= "\ntry {\n";
        $configContent .= "    \$conn = new PDO(\"mysql:host=\$host;dbname=\$db_name\", \$username, \$password);\n";
        $configContent .= "    \$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n";
        $configContent .= "    \$conn->exec(\"set names utf8\");\n";
        $configContent .= "} catch(PDOException \$e) {\n";
        $configContent .= "    echo json_encode(['success' => false, 'message' => 'Connection Error: ' . \$e->getMessage()]);\n";
        $configContent .= "    exit;\n";
        $configContent .= "}\n?>";

        if (!is_dir('config')) mkdir('config');
        file_put_contents($configFile, $configContent);

        // 5. Done
        header("Location: install.php?step=4");
        exit;

    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Enlighten Pharma - Auto Installer</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f0f2f5; display: flex; justify-content: center; padding-top: 50px; }
        .container { background: white; width: 500px; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .btn { display: block; width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 20px; }
        .btn:hover { background: #0056b3; }
        input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
        .error { background: #ffebee; color: #c62828; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
        .step-indicator { text-align: center; margin-bottom: 20px; color: #888; }
    </style>
</head>
<body>

<div class="container">
    <h1>🚀 Installer</h1>
    <div class="step-indicator">Step <?php echo $step; ?> of 4</div>

    <?php if($error): ?>
        <div class="error">❌ <?php echo $error; ?></div>
    <?php endif; ?>

    <!-- STEP 1: REQUIREMENTS -->
    <?php if($step == 1): ?>
        <h2>System Check</h2>
        <?php
        $p = check_requirement("PHP Version >= 7.4", version_compare(PHP_VERSION, '7.4.0', '>='));
        $e1 = check_requirement("MySQLi Extension", extension_loaded('mysqli'));
        $e2 = check_requirement("PDO Extension", extension_loaded('pdo'));
        $w = check_requirement("Config Directory Writable", is_writable('.') || is_writable('config'));
        
        if($p && $e1 && $e2 && $w): ?>
            <a href="install.php?step=2" class="btn" style="text-align:center;text-decoration:none;">Next Step</a>
        <?php else: ?>
            <p style="color:red">Please fix errors.</p>
        <?php endif; ?>
    <?php endif; ?>

    <!-- STEP 2: DATABASE INFO -->
    <?php if($step == 2): ?>
        <h2>Database Setup</h2>
        <form method="POST">
            <label>Database Host</label>
            <input type="text" name="host" value="localhost" required>
            <label>Database Name</label>
            <input type="text" name="name" placeholder="u123456_lakshya" required>
            <label>Database Username</label>
            <input type="text" name="user" placeholder="u123456_admin" required>
            <label>Database Password</label>
            <input type="text" name="pass" placeholder="Password" required>
            <button type="submit" class="btn">Test & Connection</button>
        </form>
    <?php endif; ?>

    <!-- STEP 3: ADMIN SETUP -->
    <?php if($step == 3): ?>
        <h2>Create Admin</h2>
        <form method="POST">
            <label>Admin Email</label>
            <input type="email" name="email" value="admin@example.com" required>
            <label>Admin Password</label>
            <input type="text" name="password" value="admin123" required>
            
            <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border: 1px solid #ffeeba; border-radius: 5px;">
                <label style="display:flex; align-items:center; gap:10px; color: #856404; cursor:pointer;">
                    <input type="checkbox" name="clean_install" value="1" style="width:auto; margin:0;">
                    🗑️ Clean Install (Delete All Existing Data)
                </label>
                <small style="display:block; margin-top:5px; color:#856404;">Check this if you are facing issues or want a fresh start. Warning: All students and courses will be deleted!</small>
            </div>

            <button type="submit" class="btn">Install System</button>
        </form>
    <?php endif; ?>

    <!-- STEP 4: SUCCESS -->
    <?php if($step == 4): ?>
        <h2 style="color:green; text-align:center">✅ Installation Complete!</h2>
        <p>The system has been installed successfully.</p>
        <div style="background:#e8f5e9; padding:15px; border-radius:5px;">
            <p><b>Admin Login:</b> <a href="/login">Click Here</a></p>
            <p>Please delete <b>install.php</b> for security!</p>
        </div>
    <?php endif; ?>

</div>

</body>
</html>
