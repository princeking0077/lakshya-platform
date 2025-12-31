<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        // 1. Count Students
        $stmt = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
        $studentCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // 2. Count Courses
        $stmt = $conn->query("SELECT COUNT(*) as count FROM courses");
        $courseCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // 3. Count Tests
        $stmt = $conn->query("SELECT COUNT(*) as count FROM tests");
        $testCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // 4. Count Results (Tests Taken)
        // Check if results table exists first
        $resultCount = 0;
        try {
             $stmt = $conn->query("SELECT COUNT(*) as count FROM results");
             $resultCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        } catch (Exception $e) { }

        // 5. Recent Registrations
        $stmt = $conn->query("SELECT id, name, email, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC LIMIT 5");
        $recentUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "stats" => [
                "students" => $studentCount,
                "courses" => $courseCount,
                "tests" => $testCount,
                "results" => $resultCount
            ],
            "recent_users" => $recentUsers
        ]);

    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
?>
