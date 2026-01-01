<?php
/**
 * Authentication Testing & Debugging Tool
 * Tests registration, login, and database connectivity
 */

header('Content-Type: text/html; charset=utf-8');

$port = 3000;
$baseUrl = "http://127.0.0.1:$port";

?>
<!DOCTYPE html>
<html>
<head>
    <title>Auth Testing Tool</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .card h2 {
            color: #333;
            margin-bottom: 15px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            color: #555;
            font-weight: 600;
            margin-bottom: 5px;
            font-size: 14px;
        }
        input, textarea {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            width: 100%;
            margin-top: 10px;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        button:active {
            transform: translateY(0);
        }
        .result {
            margin-top: 15px;
            padding: 12px;
            border-radius: 6px;
            font-size: 13px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        pre {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 12px;
            margin-top: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
        }
        .badge-running { background: #d4edda; color: #155724; }
        .badge-stopped { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Authentication Testing & Debug Tool</h1>

        <?php
        // Check if Node.js server is running
        $ch = curl_init("$baseUrl/health");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
        $healthResponse = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $serverRunning = ($httpCode === 200);
        ?>

        <div class="card" style="grid-column: 1 / -1;">
            <h2>
                Server Status
                <span class="status-badge <?= $serverRunning ? 'badge-running' : 'badge-stopped' ?>">
                    <?= $serverRunning ? '✅ RUNNING' : '❌ STOPPED' ?>
                </span>
            </h2>
            <?php if (!$serverRunning): ?>
                <div class="result warning">
                    ⚠️ Node.js server is not running!
                    <br><br>
                    <strong>To start the server:</strong>
                    <br>Visit <a href="/start-server.php" target="_blank">/start-server.php</a> and click "Start Server"
                </div>
            <?php else: ?>
                <div class="result success">
                    ✅ Server is running on port <?= $port ?>
                    <br>Health check response: <?= htmlspecialchars($healthResponse) ?>
                </div>
            <?php endif; ?>
        </div>

        <div class="grid">
            <!-- Test Registration -->
            <div class="card">
                <h2>📝 Test Registration</h2>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="register">

                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="reg_name" value="Test Student" required>
                    </div>

                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="reg_email" value="test<?= time() ?>@example.com" required>
                    </div>

                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" name="reg_phone" value="+91 9876543210">
                    </div>

                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="reg_password" value="Test@123" required>
                    </div>

                    <button type="submit">Test Registration</button>
                </form>

                <?php
                if ($_POST['action'] === 'register' && $serverRunning) {
                    $data = [
                        'name' => $_POST['reg_name'],
                        'email' => $_POST['reg_email'],
                        'phone' => $_POST['reg_phone'],
                        'password' => $_POST['reg_password']
                    ];

                    $ch = curl_init("$baseUrl/api/auth/register");
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);

                    $result = json_decode($response, true);

                    if ($httpCode === 201 || ($result && $result['success'])) {
                        echo '<div class="result success">✅ Registration Successful!<pre>' . htmlspecialchars(json_encode($result, JSON_PRETTY_PRINT)) . '</pre></div>';
                    } else {
                        echo '<div class="result error">❌ Registration Failed<br>HTTP ' . $httpCode . '<pre>' . htmlspecialchars($response) . '</pre></div>';
                    }
                }
                ?>
            </div>

            <!-- Test Login -->
            <div class="card">
                <h2>🔑 Test Login</h2>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="login">

                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="login_email" value="shoaib.ss300@gmail.com" required>
                    </div>

                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="login_password" value="Shaikh@#$001" required>
                    </div>

                    <button type="submit">Test Login</button>
                </form>

                <?php
                if ($_POST['action'] === 'login' && $serverRunning) {
                    $data = [
                        'email' => $_POST['login_email'],
                        'password' => $_POST['login_password']
                    ];

                    $ch = curl_init("$baseUrl/api/auth/login");
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_POST, true);
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);

                    $result = json_decode($response, true);

                    if ($httpCode === 200 && $result && $result['success']) {
                        echo '<div class="result success">✅ Login Successful!<br><strong>Role:</strong> ' . htmlspecialchars($result['data']['role']) . '<pre>' . htmlspecialchars(json_encode($result, JSON_PRETTY_PRINT)) . '</pre></div>';
                    } else {
                        echo '<div class="result error">❌ Login Failed<br>HTTP ' . $httpCode . '<pre>' . htmlspecialchars($response) . '</pre></div>';
                    }
                }
                ?>
            </div>

            <!-- Database Query Test -->
            <div class="card">
                <h2>🗄️ Test Database Query</h2>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="db_test">

                    <div class="form-group">
                        <label>SQL Query (SELECT only)</label>
                        <textarea name="sql_query" rows="3" required>SELECT id, name, email, role, is_approved FROM users LIMIT 5</textarea>
                    </div>

                    <button type="submit">Execute Query</button>
                </form>

                <?php
                if ($_POST['action'] === 'db_test' && $serverRunning) {
                    $query = $_POST['sql_query'];

                    // Security check - only allow SELECT
                    if (stripos(trim($query), 'SELECT') !== 0) {
                        echo '<div class="result error">❌ Only SELECT queries allowed for security</div>';
                    } else {
                        // Send to a custom debug endpoint (we'll create this)
                        $ch = curl_init("$baseUrl/api/debug-query");
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_POST, true);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['query' => $query]));
                        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                        $response = curl_exec($ch);
                        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        curl_close($ch);

                        if ($httpCode === 200) {
                            $result = json_decode($response, true);
                            echo '<div class="result success">✅ Query Executed<pre>' . htmlspecialchars(json_encode($result, JSON_PRETTY_PRINT)) . '</pre></div>';
                        } else {
                            echo '<div class="result error">❌ Query Failed<br>HTTP ' . $httpCode . '<pre>' . htmlspecialchars($response) . '</pre></div>';
                        }
                    }
                }
                ?>
            </div>

            <!-- API Endpoint Tester -->
            <div class="card">
                <h2>🌐 Test Any API Endpoint</h2>
                <form method="POST" action="">
                    <input type="hidden" name="action" value="api_test">

                    <div class="form-group">
                        <label>Method</label>
                        <select name="api_method" style="width:100%; padding:10px; border: 2px solid #e0e0e0; border-radius:6px;">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Endpoint (e.g., /api/dashboard)</label>
                        <input type="text" name="api_endpoint" value="/api/dashboard" required>
                    </div>

                    <div class="form-group">
                        <label>JSON Body (for POST)</label>
                        <textarea name="api_body" rows="3" placeholder='{"key": "value"}'></textarea>
                    </div>

                    <button type="submit">Test Endpoint</button>
                </form>

                <?php
                if ($_POST['action'] === 'api_test' && $serverRunning) {
                    $method = $_POST['api_method'];
                    $endpoint = $_POST['api_endpoint'];
                    $body = $_POST['api_body'];

                    $url = $baseUrl . $endpoint;

                    $ch = curl_init($url);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

                    if ($method === 'POST' && !empty($body)) {
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
                        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                    }

                    $response = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);

                    if ($httpCode >= 200 && $httpCode < 300) {
                        echo '<div class="result success">✅ Success (HTTP ' . $httpCode . ')<pre>' . htmlspecialchars($response) . '</pre></div>';
                    } else {
                        echo '<div class="result error">❌ Failed (HTTP ' . $httpCode . ')<pre>' . htmlspecialchars($response) . '</pre></div>';
                    }
                }
                ?>
            </div>

            <!-- Quick Links -->
            <div class="card" style="grid-column: 1 / -1;">
                <h2>🔗 Quick Links</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    <a href="/" target="_blank" style="padding: 10px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; text-align: center;">🏠 Homepage</a>
                    <a href="/register" target="_blank" style="padding: 10px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; text-align: center;">📝 Register Page</a>
                    <a href="/login" target="_blank" style="padding: 10px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; text-align: center;">🔑 Login Page</a>
                    <a href="/admin" target="_blank" style="padding: 10px; background: #f59e0b; color: white; text-decoration: none; border-radius: 6px; text-align: center;">👑 Admin Panel</a>
                    <a href="/api/debug-server" target="_blank" style="padding: 10px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 6px; text-align: center;">🔍 Debug Server</a>
                    <a href="/api/setup-db" target="_blank" style="padding: 10px; background: #ef4444; color: white; text-decoration: none; border-radius: 6px; text-align: center;">🗄️ Setup Database</a>
                    <a href="/start-server.php" target="_blank" style="padding: 10px; background: #06b6d4; color: white; text-decoration: none; border-radius: 6px; text-align: center;">🚀 Server Manager</a>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>📖 Common Issues & Solutions</h2>
            <div style="line-height: 1.8;">
                <strong>❌ Registration fails with "User already exists"</strong>
                <br>→ Email is already registered. Try a different email.
                <br><br>

                <strong>❌ Login fails with "Invalid credentials"</strong>
                <br>→ Email or password is wrong. For admin: shoaib.ss300@gmail.com / Shaikh@#$001
                <br><br>

                <strong>❌ Login fails with "Account pending approval"</strong>
                <br>→ Student account needs admin approval. Login as admin and approve at /admin/students
                <br><br>

                <strong>❌ All API calls return 503</strong>
                <br>→ Node.js server not running. Visit /start-server.php and click "Start Server"
                <br><br>

                <strong>❌ Database connection failed</strong>
                <br>→ Check environment variables in Hostinger panel. Visit /api/debug-server to verify.
                <br><br>

                <strong>✅ How to approve students</strong>
                <br>1. Login as admin at /admin
                <br>2. Go to Students section
                <br>3. Find pending students
                <br>4. Click approve
            </div>
        </div>
    </div>
</body>
</html>
