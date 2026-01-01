<?php
/**
 * Simple Node.js Server Starter for Hostinger
 * Visit this file once to start the server: /start-server.php
 */

header('Content-Type: text/html; charset=utf-8');

$appDir = __DIR__;
$pidFile = $appDir . '/node-server.pid';
$logFile = $appDir . '/node-server.log';
$appFile = $appDir . '/app.js';
$port = 3000;

?>
<!DOCTYPE html>
<html>
<head>
    <title>Node.js Server Manager</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
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
        h1 { color: #333; }
        .status {
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .warning { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
        }
        button:hover { background: #0056b3; }
        .danger { background: #dc3545; }
        .danger:hover { background: #c82333; }
        pre {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border: 1px solid #dee2e6;
        }
        .actions { margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Node.js Server Manager</h1>

        <?php
        // Handle actions
        $action = $_GET['action'] ?? '';

        if ($action === 'start') {
            echo '<div class="status info">Starting Node.js server...</div>';

            // Check if already running
            if (file_exists($pidFile)) {
                $pid = trim(file_get_contents($pidFile));
                exec("ps -p $pid 2>/dev/null", $output, $return);
                if ($return === 0) {
                    echo '<div class="status warning">⚠️ Server is already running (PID: ' . htmlspecialchars($pid) . ')</div>';
                } else {
                    unlink($pidFile);
                }
            }

            // Start server
            $command = sprintf(
                'cd %s && nohup node %s > %s 2>&1 & echo $!',
                escapeshellarg($appDir),
                escapeshellarg($appFile),
                escapeshellarg($logFile)
            );

            $pid = trim(shell_exec($command));

            if (!empty($pid) && is_numeric($pid)) {
                file_put_contents($pidFile, $pid);
                sleep(2); // Wait for server to start

                // Check if it's running
                exec("ps -p $pid 2>/dev/null", $output, $return);
                if ($return === 0) {
                    echo '<div class="status success">✅ Server started successfully!<br>PID: ' . htmlspecialchars($pid) . '</div>';
                } else {
                    echo '<div class="status error">❌ Server failed to start. Check logs below.</div>';
                }
            } else {
                echo '<div class="status error">❌ Failed to start server. Command output: ' . htmlspecialchars($pid) . '</div>';
            }
        }

        if ($action === 'stop') {
            echo '<div class="status info">Stopping Node.js server...</div>';

            if (file_exists($pidFile)) {
                $pid = trim(file_get_contents($pidFile));
                exec("kill $pid 2>/dev/null", $output, $return);

                if ($return === 0) {
                    unlink($pidFile);
                    echo '<div class="status success">✅ Server stopped successfully!</div>';
                } else {
                    echo '<div class="status warning">⚠️ Failed to stop process (PID: ' . htmlspecialchars($pid) . '). It may have already stopped.</div>';
                    if (file_exists($pidFile)) {
                        unlink($pidFile);
                    }
                }
            } else {
                echo '<div class="status warning">⚠️ No PID file found. Server may not be running.</div>';
            }
        }

        if ($action === 'restart') {
            echo '<div class="status info">Restarting Node.js server...</div>';

            // Stop
            if (file_exists($pidFile)) {
                $pid = trim(file_get_contents($pidFile));
                exec("kill $pid 2>/dev/null");
                unlink($pidFile);
                sleep(1);
            }

            // Start
            $command = sprintf(
                'cd %s && nohup node %s > %s 2>&1 & echo $!',
                escapeshellarg($appDir),
                escapeshellarg($appFile),
                escapeshellarg($logFile)
            );

            $pid = trim(shell_exec($command));

            if (!empty($pid) && is_numeric($pid)) {
                file_put_contents($pidFile, $pid);
                sleep(2);

                exec("ps -p $pid 2>/dev/null", $output, $return);
                if ($return === 0) {
                    echo '<div class="status success">✅ Server restarted successfully!<br>PID: ' . htmlspecialchars($pid) . '</div>';
                } else {
                    echo '<div class="status error">❌ Server failed to restart. Check logs below.</div>';
                }
            } else {
                echo '<div class="status error">❌ Failed to restart server.</div>';
            }
        }

        // Check current status
        $isRunning = false;
        $currentPid = null;

        if (file_exists($pidFile)) {
            $currentPid = trim(file_get_contents($pidFile));
            exec("ps -p $currentPid 2>/dev/null", $output, $return);
            $isRunning = ($return === 0);
        }

        // Display status
        if ($isRunning) {
            echo '<div class="status success">✅ <strong>Server Status: RUNNING</strong><br>PID: ' . htmlspecialchars($currentPid) . '</div>';

            // Check if server is responding
            $ch = curl_init("http://127.0.0.1:$port/health");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 2);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200) {
                echo '<div class="status success">✅ Server is responding on port ' . $port . '</div>';
                echo '<p><strong>Your site should be working now!</strong></p>';
                echo '<p>🌐 <a href="/" target="_blank">Visit Homepage</a> | ';
                echo '<a href="/admin" target="_blank">Admin Panel</a> | ';
                echo '<a href="/api/debug-server" target="_blank">Debug Info</a></p>';
            } else {
                echo '<div class="status warning">⚠️ Server process is running but not responding on port ' . $port . '</div>';
            }
        } else {
            echo '<div class="status error">❌ <strong>Server Status: NOT RUNNING</strong></div>';
            echo '<p>Click "Start Server" below to start the Node.js application.</p>';
        }
        ?>

        <div class="actions">
            <h3>Actions:</h3>
            <?php if ($isRunning): ?>
                <button class="danger" onclick="location.href='?action=stop'">⏹️ Stop Server</button>
                <button onclick="location.href='?action=restart'">🔄 Restart Server</button>
            <?php else: ?>
                <button onclick="location.href='?action=start'">▶️ Start Server</button>
            <?php endif; ?>
            <button onclick="location.reload()">🔃 Refresh Status</button>
        </div>

        <h3>📋 Server Information:</h3>
        <pre><?php
            echo "App Directory: " . $appDir . "\n";
            echo "App File: " . $appFile . "\n";
            echo "Port: " . $port . "\n";
            echo "PID File: " . $pidFile . "\n";
            echo "Log File: " . $logFile . "\n";
            echo "Node Version: " . trim(shell_exec('node --version 2>&1')) . "\n";
            echo "NPM Version: " . trim(shell_exec('npm --version 2>&1')) . "\n";
        ?></pre>

        <?php if (file_exists($logFile)): ?>
            <h3>📝 Recent Logs (last 50 lines):</h3>
            <pre><?php
                $logs = shell_exec("tail -n 50 " . escapeshellarg($logFile));
                echo htmlspecialchars($logs);
            ?></pre>
        <?php endif; ?>

        <h3>🔍 Running Node Processes:</h3>
        <pre><?php
            $processes = shell_exec('ps aux | grep -E "(node|npm)" | grep -v grep');
            echo htmlspecialchars($processes ?: 'No Node.js processes found');
        ?></pre>

    </div>
</body>
</html>
