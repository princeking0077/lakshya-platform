<?php
/**
 * Automatic Server Starter
 * This file attempts to start the Node.js server automatically
 * Place this in a location that gets hit frequently
 */

$appDir = __DIR__;
$pidFile = $appDir . '/node-server.pid';
$logFile = $appDir . '/node-server.log';
$appFile = $appDir . '/app.js';
$port = 3000;

// Function to check if server is responding
function isServerResponding($port) {
    $ch = curl_init("http://127.0.0.1:$port/health");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($httpCode === 200);
}

// Function to start server
function startServer($appDir, $appFile, $logFile, $pidFile) {
    // Try multiple methods to start the server

    // Method 1: Using exec with full path
    $nodeCmd = "cd " . escapeshellarg($appDir) . " && /usr/bin/node " . escapeshellarg($appFile);
    $fullCmd = "nohup $nodeCmd > " . escapeshellarg($logFile) . " 2>&1 & echo $!";

    $pid = trim(shell_exec($fullCmd));

    if (!empty($pid) && is_numeric($pid)) {
        file_put_contents($pidFile, $pid);
        return true;
    }

    // Method 2: Using proc_open
    $descriptors = [
        0 => ["pipe", "r"],
        1 => ["file", $logFile, "a"],
        2 => ["file", $logFile, "a"]
    ];

    $process = proc_open(
        "node " . escapeshellarg($appFile),
        $descriptors,
        $pipes,
        $appDir,
        null
    );

    if (is_resource($process)) {
        $status = proc_get_status($process);
        if ($status['running']) {
            file_put_contents($pidFile, $status['pid']);
            return true;
        }
    }

    return false;
}

// Check if server is already running
if (isServerResponding($port)) {
    // Server is running, do nothing
    exit(0);
}

// Server not responding, try to start it
if (startServer($appDir, $appFile, $logFile, $pidFile)) {
    // Wait a moment for server to start
    sleep(2);

    // Check again
    if (isServerResponding($port)) {
        error_log("Node.js server started successfully");
    } else {
        error_log("Node.js server start attempted but not responding");
    }
} else {
    error_log("Failed to start Node.js server");
}
?>
