<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: List all users (students)
if ($method == 'GET') {
    try {
        $query = "SELECT id, name, email, role, phone, is_approved, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Map id to _id and standard keys
        foreach($users as &$u) { 
            $u['_id'] = $u['id']; 
            $u['createdAt'] = $u['created_at'];
        }

        echo json_encode($users); // Frontend expects direct array or {data: []}? 
        // student/dashboard uses res.data.data? No, admin/students uses res.data directly or res.data.data?
        // Let's check frontend code.
        // admin/students/page.tsx: setStudents(res.data); -> Expects ARRAY directly.
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
// POST: Create User (Admin Add)
else if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    // Reuse register logic essentially
    if(!empty($data->name) && !empty($data->email) && !empty($data->password)) {
        // ... (Simplified insert)
        $pwd = password_hash($data->password, PASSWORD_BCRYPT);
        $role = 'student';
        $phone = $data->phone ?? '';
        
        $sql = "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if($stmt->execute([$data->name, $data->email, $pwd, $role, $phone])) {
             $id = $conn->lastInsertId();
             echo json_encode(["_id" => $id, "name" => $data->name, "email" => $data->email, "phone" => $phone]);
        }
    }
}
// DELETE: Remove User
else if ($method == 'DELETE') {
    // If using .htaccess to map /api/users/123 -> users/index.php?id=123
    // Or just simple parsing of query param
    
    // Assuming we pass ID via query string or path
    $id = $_GET['id'] ?? null;
    if(!$id) {
         // Try to parse from path info if standard routing used
         $path = explode('/', $_SERVER['REQUEST_URI']);
         $id = end($path); 
    }
    
    if($id) {
        $sql = "DELETE FROM users WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    }
}
// PUT: Approve User
else if ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    // We expect { "id": 123, "action": "approve" } or just { "is_approved": 1 }
    
    // Get ID from query param OR body
    $id = $_GET['id'] ?? $data->id ?? null;
    
    if($id) {
        // Toggle approval
        $newStatus = isset($data->is_approved) ? $data->is_approved : 1;
        
        $sql = "UPDATE users SET is_approved = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        if($stmt->execute([$newStatus, $id])) {
            echo json_encode(["success" => true, "is_approved" => $newStatus]);
        } else {
            echo json_encode(["success" => false, "message" => "Update failed"]);
        }
    }
}
?>
