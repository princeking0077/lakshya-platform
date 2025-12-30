<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Check for specific sub-route logic (e.g., /my)
    // Since we are using simple file routing, we might need query params or path info
    // For "http://domain.com/api/results/my", PHP sees "/api/results/my"
    
    // Quick hack for "my results": React likely calls /api/results/my
    // We can assume if no ID provided in query, it MIGHT be "my" or "all".
    // But we need the USER ID from the Token. Authentication is needed here.
    // For this Hostinger setup, let's assume the frontend sends a header (which it does).
    // We need a helper to validate token.
    
    // Let's implement a quick token check if Authorization header exists.
    // Since we didn't use a library, we need to decode base64.
    
    $headers = getallheaders();
    $userId = null;
    $role = null;
    
    if(isset($headers['Authorization'])) {
        $token = str_replace('Bearer ', '', $headers['Authorization']);
        $decoded = json_decode(base64_decode($token), true);
        if($decoded && isset($decoded['id'])) {
            $userId = $decoded['id'];
            $role = $decoded['role'];
        }
    }
    
    // Route: /api/results/my
    // In strict file based: /api/results/index.php handles /api/results
    // If client calls /api/results/my ... this file might NOT be hit unless .htaccess rewrites
    // OR if we make a folder api/results/my/index.php.
    
    // Simplest approach: Client calls /api/results/my.php created below.
    // BUT frontend code calls `/api/results/my`.
    
    // We need .htaccess to handle pure URLs. 
    // I will CREATE an .htaccess in the root of server-php to map URLs.
    
    if ($userId) {
        try {
            // Fetch results for this user with Test details
            $query = "SELECT r.*, t.title as test_title, t.total_marks as test_total 
                      FROM results r 
                      JOIN tests t ON r.test_id = t.id 
                      WHERE r.user_id = :uid 
                      ORDER BY r.submitted_at DESC";
                      
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':uid', $userId);
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(["success" => true, "data" => $results]);
        } catch(PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Unauthorized"]);
    }
}
?>
