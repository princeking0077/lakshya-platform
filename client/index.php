<?php
/**
 * PHP Bootstrap for Node.js Application on Hostinger
 * This file starts the Node.js server and proxies requests to it
 */

// Configuration
define('NODE_PORT', 3000);
define('NODE_APP', __DIR__ . '/app.js');
define('PID_FILE', __DIR__ . '/node-server.pid');
define('LOG_FILE', __DIR__ . '/node-server.log');

/**
 * Check if Node.js server is running
 */
function isServerRunning() {
    if (!file_exists(PID_FILE)) {
        return false;
    }

    $pid = trim(file_get_contents(PID_FILE));
    if (empty($pid)) {
        return false;
    }

    // Check if process exists
    exec("ps -p $pid", $output, $return);
    return $return === 0;
}

/**
 * Start Node.js server
 */
function startServer() {
    $nodeCmd = "node " . escapeshellarg(NODE_APP);
    $logFile = escapeshellarg(LOG_FILE);

    // Start Node.js in background and save PID
    $command = "nohup $nodeCmd > $logFile 2>&1 & echo $!";
    $pid = trim(shell_exec($command));

    if (!empty($pid)) {
        file_put_contents(PID_FILE, $pid);

        // Wait a bit for server to start
        sleep(2);

        return true;
    }

    return false;
}

/**
 * Proxy request to Node.js server
 */
function proxyToNode() {
    $url = 'http://127.0.0.1:' . NODE_PORT . $_SERVER['REQUEST_URI'];

    // Initialize cURL
    $ch = curl_init($url);

    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

    // Forward headers
    $headers = [];
    foreach (getallheaders() as $name => $value) {
        if (strtolower($name) !== 'host') {
            $headers[] = "$name: $value";
        }
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    // Forward POST data
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $postData = file_get_contents('php://input');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    }

    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);

    curl_close($ch);

    // Send response
    http_response_code($httpCode);
    if ($contentType) {
        header("Content-Type: $contentType");
    }

    echo $response;
}

/**
 * Main execution
 */

// Check if server is running, start if not
if (!isServerRunning()) {
    if (!startServer()) {
        http_response_code(503);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Failed to start Node.js server',
            'details' => 'Check ' . LOG_FILE . ' for errors',
            'app_path' => NODE_APP,
            'log_file' => LOG_FILE
        ]);
        exit;
    }
}

// Check if server is responding
$ch = curl_init('http://127.0.0.1:' . NODE_PORT . '/health');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 2);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
$healthCheck = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// If server not responding, try to restart
if ($httpCode === 0 || $httpCode >= 500) {
    // Kill old process
    if (file_exists(PID_FILE)) {
        $pid = trim(file_get_contents(PID_FILE));
        if (!empty($pid)) {
            exec("kill $pid 2>/dev/null");
        }
        unlink(PID_FILE);
    }

    // Start new server
    if (!startServer()) {
        http_response_code(503);
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Node.js server not responding',
            'details' => 'Server failed to restart. Check logs.',
            'log_file' => LOG_FILE
        ]);
        exit;
    }
}

// Proxy all requests to Node.js
proxyToNode();
?>
