<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: List assignments for a user (or all if admin?)
// URL: /api/assignments?user_id=123
if ($method == 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    
    if ($user_id) {
        // Get user's active assignments with course details
        $query = "
            SELECT ca.*, c.title as course_title, c.thumbnail 
            FROM course_assignments ca 
            JOIN courses c ON ca.course_id = c.id 
            WHERE ca.user_id = :uid 
            AND (ca.expires_at IS NULL OR ca.expires_at > NOW())
            ORDER BY ca.assigned_at DESC
        ";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':uid', $user_id);
    } else {
        // Admin: List all assignments? Or return empty?
        // Let's return all for now if needed, or error.
        echo json_encode(["success" => false, "message" => "User ID required"]);
        exit;
    }
    
    try {
        $stmt->execute();
        $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "data" => $assignments]);
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// POST: Assign a course to a user
else if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->user_id) && !empty($data->course_id)) {
        try {
            // Check if already assigned
            $check = "SELECT id FROM course_assignments WHERE user_id = :uid AND course_id = :cid";
            $stmt = $conn->prepare($check);
            $stmt->execute([':uid' => $data->user_id, ':cid' => $data->course_id]);
            
            if($stmt->rowCount() > 0) {
                // Update expiry if exists
                $update = "UPDATE course_assignments SET expires_at = :exp WHERE user_id = :uid AND course_id = :cid";
                $uStmt = $conn->prepare($update);
                $expiry = !empty($data->expires_at) ? $data->expires_at : null;
                $uStmt->execute([':exp' => $expiry, ':uid' => $data->user_id, ':cid' => $data->course_id]);
                echo json_encode(["success" => true, "message" => "Assignment updated"]);
            } else {
                // Create new
                $sql = "INSERT INTO course_assignments (user_id, course_id, expires_at) VALUES (:uid, :cid, :exp)";
                $stmt = $conn->prepare($sql);
                $expiry = !empty($data->expires_at) ? $data->expires_at : null;
                
                if($stmt->execute([':uid' => $data->user_id, ':cid' => $data->course_id, ':exp' => $expiry])) {
                    echo json_encode(["success" => true, "message" => "Course assigned successfully"]);
                } else {
                    echo json_encode(["success" => false, "message" => "Failed to assign course"]);
                }
            }
        } catch(PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    } else {
         echo json_encode(["success" => false, "message" => "Missing user_id or course_id"]);
    }
}

// DELETE: Revoke assignment
else if ($method == 'DELETE') {
    $id = $_GET['id'] ?? null; // assignment id
    // OR user_id + course_id
    
    if($id) {
        $sql = "DELETE FROM course_assignments WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':id' => $id]);
        echo json_encode(["success" => true, "message" => "Assignment revoked"]);
    }
}
?>
