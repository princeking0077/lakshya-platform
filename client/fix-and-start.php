<?php
/**
 * Fix app.js and Start Server
 * This script fixes the wildcard route issue and starts the Node.js server
 */

header('Content-Type: text/html; charset=utf-8');

$appDir = __DIR__;
$appFile = $appDir . '/app.js';
$logFile = $appDir . '/server.log';
$pidFile = $appDir . '/node-server.pid';

?>
<!DOCTYPE html>
<html>
<head>
    <title>Fix & Start Server</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 900px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        h1 { color: #333; }
        .step {
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .success { background: #d4edda; border-left-color: #28a745; color: #155724; }
        .error { background: #f8d7da; border-left-color: #dc3545; color: #721c24; }
        .info { background: #d1ecf1; border-left-color: #17a2b8; color: #0c5460; }
        .warning { background: #fff3cd; border-left-color: #ffc107; color: #856404; }
        pre {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 12px;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        button:hover { background: #5568d3; }
        .btn-success { background: #28a745; }
        .btn-success:hover { background: #218838; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Fix & Start Server</h1>

        <?php
        if (isset($_POST['action'])) {
            $action = $_POST['action'];

            if ($action === 'fix_and_start') {
                echo '<h2>Step 1: Fixing app.js wildcard route</h2>';

                // Fix the wildcard route in app.js
                $appContent = file_get_contents($appFile);

                if ($appContent === false) {
                    echo '<div class="step error">❌ Failed to read app.js</div>';
                } else {
                    // Replace app.get('*' with app.get('/*'
                    $originalContent = $appContent;
                    $appContent = str_replace("app.get('*'", "app.get('/*'", $appContent);

                    if ($appContent !== $originalContent) {
                        file_put_contents($appFile, $appContent);
                        echo '<div class="step success">✅ Fixed: Changed app.get(\'*\') to app.get(\'/*\')</div>';
                    } else {
                        echo '<div class="step info">ℹ️ app.js already has correct route pattern</div>';
                    }
                }

                echo '<h2>Step 2: Stopping old server processes</h2>';

                // Kill existing Node.js processes
                exec('pkill -f "node app.js" 2>&1', $killOutput, $killReturn);
                echo '<div class="step info">Killed old processes</div>';
                sleep(1);

                echo '<h2>Step 3: Starting Node.js server</h2>';

                // Start the server using proc_open (which is available)
                $command = 'source /opt/alt/alt-nodejs18/enable && cd ' . escapeshellarg($appDir) . ' && nohup node app.js > ' . escapeshellarg($logFile) . ' 2>&1 & echo $!';

                $descriptors = [
                    0 => ["pipe", "r"],
                    1 => ["pipe", "w"],
                    2 => ["pipe", "w"]
                ];

                $process = proc_open($command, $descriptors, $pipes, $appDir);

                if (is_resource($process)) {
                    $pid = trim(stream_get_contents($pipes[1]));
                    fclose($pipes[0]);
                    fclose($pipes[1]);
                    fclose($pipes[2]);
                    proc_close($process);

                    if (!empty($pid) && is_numeric($pid)) {
                        file_put_contents($pidFile, $pid);
                        echo '<div class="step success">✅ Server started with PID: ' . htmlspecialchars($pid) . '</div>';
                    } else {
                        echo '<div class="step warning">⚠️ Server start command executed, checking status...</div>';
                    }
                } else {
                    echo '<div class="step error">❌ Failed to start server using proc_open</div>';
                }

                // Wait for server to start
                sleep(3);

                echo '<h2>Step 4: Checking server status</h2>';

                // Check if server is responding
                $ch = curl_init('http://127.0.0.1:3000/health');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 3);
                curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
                $healthResponse = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if ($httpCode === 200) {
                    echo '<div class="step success">';
                    echo '<strong>✅ SERVER IS RUNNING!</strong><br><br>';
                    echo 'Health check response: <code>' . htmlspecialchars($healthResponse) . '</code><br><br>';
                    echo '<strong>Your site is now live at:</strong><br>';
                    echo '<a href="https://enlightenpharma.in/" target="_blank" style="font-size: 18px; color: #667eea;">https://enlightenpharma.in/</a>';
                    echo '</div>';
                } else {
                    echo '<div class="step error">';
                    echo '❌ Server not responding yet (HTTP ' . $httpCode . ')<br>';
                    echo 'This might take a moment. Check logs below.';
                    echo '</div>';
                }

                echo '<h2>Step 5: Server Logs</h2>';

                if (file_exists($logFile)) {
                    $logs = shell_exec('tail -30 ' . escapeshellarg($logFile));
                    echo '<div class="step info">';
                    echo '<strong>Last 30 lines of server.log:</strong>';
                    echo '<pre>' . htmlspecialchars($logs) . '</pre>';
                    echo '</div>';
                } else {
                    echo '<div class="step warning">⚠️ Log file not created yet</div>';
                }

                echo '<h2>✅ Done!</h2>';
                echo '<div class="step success">';
                echo '<strong>Next steps:</strong><br>';
                echo '1. Visit <a href="https://enlightenpharma.in/" target="_blank">https://enlightenpharma.in/</a><br>';
                echo '2. Initialize database: <a href="/api/setup-db" target="_blank">/api/setup-db</a><br>';
                echo '3. Login as admin: <a href="/admin" target="_blank">/admin</a> (shoaib.ss300@gmail.com / Shaikh@#$001)<br>';
                echo '</div>';

                echo '<form method="GET"><button type="submit" class="btn-success">🔄 Refresh Page</button></form>';
            }
        } else {
            // Show initial form
            ?>
            <div class="step info">
                <h3>What this script does:</h3>
                <ol>
                    <li>Fixes the wildcard route error in app.js (changes <code>app.get('*')</code> to <code>app.get('/*')</code>)</li>
                    <li>Stops any existing Node.js processes</li>
                    <li>Starts the Node.js server with proper Node.js 18 environment</li>
                    <li>Verifies the server is running</li>
                    <li>Shows you the logs</li>
                </ol>
            </div>

            <?php
            // Check current status
            $ch = curl_init('http://127.0.0.1:3000/health');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 2);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200) {
                echo '<div class="step success">';
                echo '<strong>✅ Server is already running!</strong><br><br>';
                echo 'Your site is live at: <a href="https://enlightenpharma.in/" target="_blank">https://enlightenpharma.in/</a><br><br>';
                echo 'You can still click the button below to restart the server if needed.';
                echo '</div>';
            } else {
                echo '<div class="step error">';
                echo '<strong>❌ Server is not running</strong><br><br>';
                echo 'Click the button below to fix and start the server.';
                echo '</div>';
            }
            ?>

            <form method="POST">
                <input type="hidden" name="action" value="fix_and_start">
                <button type="submit" class="btn-success" style="font-size: 18px; padding: 15px 30px;">
                    🚀 Fix & Start Server Now
                </button>
            </form>

            <div style="margin-top: 30px;">
                <h3>Other Tools:</h3>
                <a href="check-hosting.php"><button type="button">🔍 Check Hosting</button></a>
                <a href="test-auth.php"><button type="button">🔐 Test Auth</button></a>
                <a href="/"><button type="button">🏠 Homepage</button></a>
            </div>
            <?php
        }
        ?>
    </div>
</body>
</html>
