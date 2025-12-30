<?php
require_once '../../cors.php';
require_once '../../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET: Fetch all tests
if ($method == 'GET') {
    try {
        $query = "SELECT * FROM tests ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $tests = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch questions for each test? Maybe only detail view.
        // Let's fetch basic info.
        
        foreach($tests as &$test) {
             $test['_id'] = $test['id'];
             // Get question count
             $q_query = "SELECT COUNT(*) as count FROM questions WHERE test_id = :tid";
             $q_stmt = $conn->prepare($q_query);
             $q_stmt->bindParam(':tid', $test['id']);
             $q_stmt->execute();
             $test['questions'] = array_fill(0, $q_stmt->fetch(PDO::FETCH_ASSOC)['count'], null); // Dummy array to show length
        }

        echo json_encode(["success" => true, "data" => $tests]);
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}

// POST: Create a test
else if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->title)) {
        try {
            $conn->beginTransaction();

            // Insert Test
            $query = "INSERT INTO tests (title, duration, total_marks, negative_marks) VALUES (:title, :duration, :total, :neg)";
            $stmt = $conn->prepare($query);
            
            $stmt->bindParam(':title', $data->title);
            $dur = $data->duration ?? 180;
            $stmt->bindParam(':duration', $dur);
            $total = $data->totalMarks ?? 0;
            $stmt->bindParam(':total', $total);
            $neg = $data->negativeMarks ?? 1.0;
            $stmt->bindParam(':neg', $neg);
            
            $stmt->execute();
            $test_id = $conn->lastInsertId();

            // Insert Questions
            if(!empty($data->questions) && is_array($data->questions)) {
                $q_sql = "INSERT INTO questions (test_id, question_text, option_1, option_2, option_3, option_4, correct_option, marks) VALUES (:tid, :txt, :o1, :o2, :o3, :o4, :correct, :marks)";
                $q_stmt = $conn->prepare($q_sql);

                foreach($data->questions as $q) {
                    $q_stmt->bindParam(':tid', $test_id);
                    $q_stmt->bindParam(':txt', $q->questionText);
                    $q_stmt->bindParam(':o1', $q->options[0]);
                    $q_stmt->bindParam(':o2', $q->options[1]);
                    $q_stmt->bindParam(':o3', $q->options[2]);
                    $q_stmt->bindParam(':o4', $q->options[3]);
                    $q_stmt->bindParam(':correct', $q->correctOption);
                    $m = $q->marks ?? 4;
                    $q_stmt->bindParam(':marks', $m);
                    $q_stmt->execute();
                }
            }

            $conn->commit();
            echo json_encode(["success" => true, "data" => ["_id" => $test_id]]);

        } catch(PDOException $e) {
            $conn->rollBack();
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    }
}
?>
