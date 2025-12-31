<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// GET: Fetch courses (All or Single)
if ($method == 'GET') {
    try {
        if ($id) {
            // Fetch Single Course
            $query = "SELECT * FROM courses WHERE id = :id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $course = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($course) {
                // Fetch Content
                $c_query = "SELECT * FROM course_materials WHERE course_id = :cid ORDER BY id ASC";
                $c_stmt = $conn->prepare($c_query);
                $c_stmt->bindParam(':cid', $id);
                $c_stmt->execute();
                $course['content'] = $c_stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Add _id for frontend compatibility
                 $course['_id'] = $course['id'];
                 
                echo json_encode(["success" => true, "data" => $course]);
            } else {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Course not found"]);
            }
        } else {
            // Fetch All Courses
            $query = "SELECT * FROM courses ORDER BY created_at DESC";
            $stmt = $conn->prepare($query);
            $stmt->execute();
            $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch content preview & Map keys
            foreach($courses as &$course) {
                $c_query = "SELECT COUNT(*) as count FROM course_materials WHERE course_id = :cid";
                $c_stmt = $conn->prepare($c_query);
                $c_stmt->bindParam(':cid', $course['id']);
                $c_stmt->execute();
                $course['content_count'] = $c_stmt->fetchColumn();
                
                $course['_id'] = $course['id'];
                $course['createdAt'] = $course['created_at'];
            }

            echo json_encode(["success" => true, "data" => $courses]);
        }
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
                $newId = $conn->lastInsertId();
                 // Return the created object structure
                echo json_encode([
                    "success" => true, 
                    "data" => [
                        "_id" => $newId, 
                        "id" => $newId,
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

// PUT: Update a course (and its content)
else if ($method == 'PUT' && $id) {
    $data = json_decode(file_get_contents("php://input"));
    
    try {
        $conn->beginTransaction();

        // 1. Update Course Details
        $query = "UPDATE courses SET title = :title, description = :description, category = :category, price = :price WHERE id = :id";
        $stmt = $conn->prepare($query);
        // We need to fetch existing if fields are missing, but let's assume frontend sends all or we use COALESCE in SQL (harder with PDO binding).
        // Use Fetch first approach? Or simplified: Frontend SHOULD send general info.
        // If data is missing, we might blank it out. Let's assume frontend sends full object.
        
        // Wait, CourseEditor sends `content` array but mainly updates content. Check what it sends.
        // It sends `{ content: updatedContent }`. It might NOT send title/desc.
        
        // Let's allow partial updates for top-level fields
        if(isset($data->title) || isset($data->description)) {
             $updateFields = [];
             if(isset($data->title)) $updateFields[] = "title = :title";
             if(isset($data->description)) $updateFields[] = "description = :description";
             if(isset($data->category)) $updateFields[] = "category = :category";
             if(isset($data->price)) $updateFields[] = "price = :price";
             
             if(!empty($updateFields)) {
                 $q = "UPDATE courses SET " . implode(", ", $updateFields) . " WHERE id = :id";
                 $uStmt = $conn->prepare($q);
                 $uStmt->bindParam(':id', $id);
                 if(isset($data->title)) $uStmt->bindParam(':title', $data->title);
                 if(isset($data->description)) $uStmt->bindParam(':description', $data->description);
                 if(isset($data->category)) $uStmt->bindParam(':category', $data->category);
                 if(isset($data->price)) $uStmt->bindParam(':price', $data->price);
                 $uStmt->execute();
             }
        }
        
        // 2. Update Content (Full Replacement Strategy for Simplicity)
        if(isset($data->content) && is_array($data->content)) {
            // Delete existing content
            $delQuery = "DELETE FROM course_materials WHERE course_id = :id";
            $delStmt = $conn->prepare($delQuery);
            $delStmt->bindParam(':id', $id);
            $delStmt->execute();
            
            // Insert new content
            $insQuery = "INSERT INTO course_materials (course_id, title, type, url, folder, is_free) VALUES (:cid, :title, :type, :url, :folder, :free)";
            $insStmt = $conn->prepare($insQuery);
            
            foreach($data->content as $item) {
                $insStmt->bindParam(':cid', $id);
                $insStmt->bindParam(':title', $item->title);
                $insStmt->bindParam(':type', $item->type);
                $insStmt->bindParam(':url', $item->url);
                
                $folder = $item->folder ?? null;
                $insStmt->bindParam(':folder', $folder); // Handle New Folder Column
                
                $free = isset($item->is_free) && $item->is_free ? 1 : 0;
                $insStmt->bindParam(':free', $free);
                
                $insStmt->execute();
            }
        }
        
        $conn->commit();
        echo json_encode(["success" => true, "message" => "Course updated"]);
        
    } catch(Exception $e) {
        $conn->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// DELETE: Delete a course
else if ($method == 'DELETE' && $id) {
    try {
        $query = "DELETE FROM courses WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if($stmt->execute()) {
             echo json_encode(["success" => true, "message" => "Course deleted"]);
        } else {
             echo json_encode(["success" => false, "message" => "Failed to delete"]);
        }
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
?>
