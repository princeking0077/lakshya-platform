<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch all courses
if ($method == 'GET') {
    try {
        $query = "SELECT * FROM courses ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch content for each course (simplified N+1 for now, better to join or lazy load)
        foreach($courses as &$course) {
            $c_query = "SELECT * FROM course_materials WHERE course_id = :cid";
            $c_stmt = $conn->prepare($c_query);
            $c_stmt->bindParam(':cid', $course['id']);
            $c_stmt->execute();
            $course['content'] = $c_stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Map _id to id for frontend compatibility if needed, though frontend likely uses _id. 
            // We should alias id as _id in SQL or map here.
            $course['_id'] = $course['id'];
        }

        echo json_encode(["success" => true, "data" => $courses]);
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// POST: Create a course
else if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->title)) {
        try {
            $query = "INSERT INTO courses (title, description, category, price) VALUES (:title, :description, :category, :price)";
            $stmt = $conn->prepare($query);
            
            $stmt->bindParam(':title', $data->title);
            $desc = $data->description ?? '';
            $stmt->bindParam(':description', $desc);
            $cat = $data->category ?? 'GPAT';
            $stmt->bindParam(':category', $cat);
            $price = $data->price ?? 0;
            $stmt->bindParam(':price', $price);
            
            if($stmt->execute()) {
                $id = $conn->lastInsertId();
                 // Return the created object structure
                echo json_encode([
                    "success" => true, 
                    "data" => [
                        "_id" => $id, 
                        "title" => $data->title,
                        "description" => $desc,
                        "category" => $cat, 
                        "price" => $price,
                        "content" => []
                    ]
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to create course"]);
            }
        } catch(PDOException $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    }
}
?>
