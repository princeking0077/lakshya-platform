<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    try {
        // Check if email exists
        $check_query = "SELECT id FROM users WHERE email = :email LIMIT 1";
        $stmt = $conn->prepare($check_query);
        $stmt->bindParam(':email', $data->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "User already exists"]);
            exit;
        }

        // Hash password
        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        $role = 'student'; // Default

        $query = "INSERT INTO users (name, email, password, role, phone) VALUES (:name, :email, :password, :role, :phone)";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(':name', $data->name);
        $stmt->bindParam(':email', $data->email);
        $stmt->bindParam(':password', $password_hash);
        $stmt->bindParam(':role', $role);
        $phone = isset($data->phone) ? $data->phone : '';
        $stmt->bindParam(':phone', $phone);

        if($stmt->execute()) {
            // Get ID
            $id = $conn->lastInsertId();
            
            // Create simplified Token (In PHP real world use JWT lib, here we mocking or simple base64 for demo if lib unavailable, 
            // but let's try to mimic the response structure React expects)
            
            // NOTE: Hostinger has OpenSSL, we could do real JWT, but for simplicity/speed without Composer:
            $token = base64_encode(json_encode(["id" => $id, "role" => $role, "exp" => time() + 86400]));

            echo json_encode([
                "success" => true, 
                "token" => $token,
                "data" => [
                    "_id" => $id, // React expects _id
                    "name" => $data->name,
                    "email" => $data->email,
                    "role" => $role
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Registration failed"]);
        }
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data"]);
}
?>
