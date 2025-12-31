<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    try {
        $query = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($data->password, $row['password'])) {
                
                // CHECK APPROVAL (Only for Students)
                if($row['role'] == 'student' && $row['is_approved'] == 0) {
                     echo json_encode(["success" => false, "message" => "Account pending approval from Admin."]);
                     exit;
                }
                
                // Simple Token
                $token = base64_encode(json_encode(["id" => $row['id'], "role" => $row['role'], "exp" => time() + 86400]));

                echo json_encode([
                    "success" => true,
                    "token" => $token,
                    "data" => [
                        "_id" => $row['id'], // Keeping _id for Frontend compatibility
                        "name" => $row['name'],
                        "email" => $row['email'],
                        "role" => $row['role']
                    ]
                ]);
            } else {
                echo json_encode(["success" => false, "message" => "Invalid credentials"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
}
?>
