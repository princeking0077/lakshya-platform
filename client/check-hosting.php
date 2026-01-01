<?php
/**
 * Hosting Environment Checker
 * Checks what's available on your hosting
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Hosting Environment Check</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; border-bottom: 3px solid #667eea; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .check { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; border-left: 4px solid #28a745; }
        .error { background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545; }
        .warning { background: #fff3cd; color: #856404; border-left: 4px solid #ffc107; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
        code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Hosting Environment Checker</h1>

        <h2>PHP Functions</h2>

        <?php
        $functions = ['exec', 'shell_exec', 'system', 'passthru', 'proc_open', 'popen'];
        foreach ($functions as $func) {
            $available = function_exists($func);
            $class = $available ? 'success' : 'error';
            $status = $available ? '✅ Available' : '❌ Disabled';
            echo "<div class='check $class'><strong>$func()</strong>: $status</div>";
        }
        ?>

        <h2>Command Execution Test</h2>

        <?php
        // Test Node.js
        $nodeVersion = @shell_exec('node --version 2>&1');
        if ($nodeVersion) {
            echo "<div class='check success'>✅ Node.js: <code>" . htmlspecialchars(trim($nodeVersion)) . "</code></div>";

            $nodePath = @shell_exec('which node 2>&1');
            if ($nodePath) {
                echo "<div class='check success'>Node.js path: <code>" . htmlspecialchars(trim($nodePath)) . "</code></div>";
            }
        } else {
            echo "<div class='check error'>❌ Node.js not found or shell_exec disabled</div>";
        }

        // Test npm
        $npmVersion = @shell_exec('npm --version 2>&1');
        if ($npmVersion) {
            echo "<div class='check success'>✅ npm: <code>" . htmlspecialchars(trim($npmVersion)) . "</code></div>";
        } else {
            echo "<div class='check warning'>⚠️ npm not found or not accessible</div>";
        }

        // Test process commands
        $psTest = @shell_exec('ps aux | head -n 1 2>&1');
        if ($psTest && strpos($psTest, 'USER') !== false) {
            echo "<div class='check success'>✅ Process commands (ps) work</div>";
        } else {
            echo "<div class='check error'>❌ Process commands (ps) don't work</div>";
        }

        // Test if we can start a background process
        $testCmd = "sleep 1 & echo $!";
        $testPid = @shell_exec($testCmd);
        if ($testPid && is_numeric(trim($testPid))) {
            echo "<div class='check success'>✅ Background processes work (PID: " . htmlspecialchars(trim($testPid)) . ")</div>";
        } else {
            echo "<div class='check error'>❌ Cannot start background processes</div>";
        }
        ?>

        <h2>Server Information</h2>

        <?php
        echo "<div class='check success'>PHP Version: <code>" . PHP_VERSION . "</code></div>";
        echo "<div class='check success'>Server Software: <code>" . htmlspecialchars($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . "</code></div>";
        echo "<div class='check success'>Document Root: <code>" . htmlspecialchars($_SERVER['DOCUMENT_ROOT'] ?? 'Unknown') . "</code></div>";
        echo "<div class='check success'>Current Directory: <code>" . htmlspecialchars(getcwd()) . "</code></div>";
        ?>

        <h2>Disabled Functions</h2>

        <?php
        $disabledFunctions = ini_get('disable_functions');
        if ($disabledFunctions) {
            $functions = explode(',', $disabledFunctions);
            echo "<div class='check warning'>";
            echo "<strong>Disabled PHP functions:</strong><br>";
            foreach ($functions as $func) {
                echo "• " . htmlspecialchars(trim($func)) . "<br>";
            }
            echo "</div>";
        } else {
            echo "<div class='check success'>✅ No functions are disabled</div>";
        }
        ?>

        <h2>File Permissions</h2>

        <?php
        $appJs = __DIR__ . '/app.js';
        if (file_exists($appJs)) {
            $perms = fileperms($appJs);
            $permsStr = substr(sprintf('%o', $perms), -4);
            echo "<div class='check success'>app.js permissions: <code>$permsStr</code></div>";
            echo "<div class='check success'>app.js readable: " . (is_readable($appJs) ? '✅ Yes' : '❌ No') . "</div>";
        } else {
            echo "<div class='check error'>❌ app.js not found at: <code>$appJs</code></div>";
        }

        $canWrite = is_writable(__DIR__);
        echo "<div class='check " . ($canWrite ? 'success' : 'error') . "'>Directory writable: " . ($canWrite ? '✅ Yes' : '❌ No') . "</div>";
        ?>

        <h2>Node.js Process Check</h2>

        <?php
        $processes = @shell_exec('ps aux | grep node 2>&1');
        if ($processes) {
            echo "<div class='check success'><strong>Node.js processes:</strong><pre>" . htmlspecialchars($processes) . "</pre></div>";
        } else {
            echo "<div class='check warning'>⚠️ Cannot check processes or no Node.js processes running</div>";
        }
        ?>

        <h2>Port 3000 Check</h2>

        <?php
        $ch = curl_init('http://127.0.0.1:3000/health');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            echo "<div class='check success'>✅ Node.js server is responding on port 3000<br><strong>Response:</strong> <code>" . htmlspecialchars($response) . "</code></div>";
        } else {
            echo "<div class='check error'>❌ Node.js server NOT responding on port 3000 (HTTP $httpCode)</div>";
        }
        ?>

        <h2>Recommendation</h2>

        <?php
        if (!function_exists('shell_exec') || !function_exists('exec')) {
            echo "<div class='check error'>";
            echo "<strong>❌ Critical functions are disabled</strong><br><br>";
            echo "Your hosting has disabled <code>shell_exec()</code> and <code>exec()</code>. ";
            echo "This means the PHP-based server manager won't work.<br><br>";
            echo "<strong>Solution:</strong> You MUST use SSH to start the server.<br>";
            echo "Read <a href='START_SERVER_SSH.md' target='_blank'>START_SERVER_SSH.md</a> for instructions.";
            echo "</div>";
        } elseif ($httpCode === 200) {
            echo "<div class='check success'>";
            echo "<strong>✅ Server is already running!</strong><br><br>";
            echo "Your Node.js server is active and responding. Your site should be working at:<br>";
            echo "<a href='https://enlightenpharma.in/' target='_blank'>https://enlightenpharma.in/</a>";
            echo "</div>";
        } else {
            echo "<div class='check warning'>";
            echo "<strong>⚠️ Server not running but PHP functions available</strong><br><br>";
            echo "Try starting the server:<br>";
            echo "1. Visit <a href='start-server.php'>start-server.php</a> and click \"Start Server\"<br>";
            echo "2. If that doesn't work, use SSH (see <a href='START_SERVER_SSH.md' target='_blank'>START_SERVER_SSH.md</a>)";
            echo "</div>";
        }
        ?>

        <h2>Quick Links</h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-top: 20px;">
            <a href="start-server.php" style="padding: 10px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; text-align: center;">🚀 Server Manager</a>
            <a href="test-auth.php" style="padding: 10px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; text-align: center;">🔐 Auth Tester</a>
            <a href="/" style="padding: 10px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; text-align: center;">🏠 Homepage</a>
            <a href="START_SERVER_SSH.md" target="_blank" style="padding: 10px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px; text-align: center;">📖 SSH Guide</a>
        </div>
    </div>
</body>
</html>
