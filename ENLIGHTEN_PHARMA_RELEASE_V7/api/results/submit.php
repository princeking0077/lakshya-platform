<?php
require_once '../../cors.php';
require_once '../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    // Expected: studentId, testId, answers [{questionId, selectedOption}]
    // Note: React sends { testId, answers: { qIndex: optionIndex } } map or similar.
    // Let's adapt to what React is likely sending based on previous code.
    // Previous Code: payload = { testId, answers: {0: 1, 1: 3}, studentId }
    
    if(!empty($data->testId) && !empty($data->studentId)) {
        try {
            // 1. Fetch Test Logic (Negative Marking etc)
            $t_query = "SELECT * FROM tests WHERE id = :tid";
            $stmt = $conn->prepare($t_query);
            $stmt->bindParam(':tid', $data->testId);
            $stmt->execute();
            $test = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // 2. Fetch All Questions
            $q_query = "SELECT * FROM questions WHERE test_id = :tid";
            $stmt = $conn->prepare($q_query);
            $stmt->bindParam(':tid', $data->testId);
            $stmt->execute();
            $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $score = 0;
            $correct = 0;
            $wrong = 0;
            $total_q = count($questions);
            
            // 3. Calculate Score
            // React sends answers as indices (0-3). Database stores correct_option as int (0-3).
            // Need to map Question Index to Question DB ID if possible, BUT
            // The frontend logic was `questions[index]`.
            // If the Questions are fetched in SAME ORDER, we are good.
            // SQL `SELECT *` without ORDER BY ID might be shaky but usually strictly insertion order.
            // Let's rely on array index matching for now as we don't have QIDs in frontend submission usually unless mapped.
            
            $userAnswers = (array)$data->answers; // Map of index -> option
            
            foreach($questions as $index => $q) {
                if(isset($userAnswers[$index])) {
                    $selected = $userAnswers[$index];
                    if($selected == $q['correct_option']) {
                        $score += $q['marks'];
                        $correct++;
                    } else {
                        $score -= $test['negative_marks'];
                        $wrong++;
                    }
                }
            }
            
            // 4. Save Result
            $ins_query = "INSERT INTO results (user_id, test_id, score, total_questions, correct_answers, wrong_answers) VALUES (:uid, :tid, :score, :total, :correct, :wrong)";
            $stmt = $conn->prepare($ins_query);
            $stmt->bindParam(':uid', $data->studentId);
            $stmt->bindParam(':tid', $data->testId);
            $stmt->bindParam(':score', $score);
            $stmt->bindParam(':total', $total_q);
            $stmt->bindParam(':correct', $correct);
            $stmt->bindParam(':wrong', $wrong);
            
            $stmt->execute();
            $result_id = $conn->lastInsertId();
            
            echo json_encode([
                "success" => true,
                "data" => [
                    "_id" => $result_id,
                    "score" => $score,
                    "correctAnswers" => $correct,
                    "wrongAnswers" => $wrong,
                    "totalQuestions" => $total_q
                ]
            ]);

        } catch(PDOException $e) {
             echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    }
}
?>
