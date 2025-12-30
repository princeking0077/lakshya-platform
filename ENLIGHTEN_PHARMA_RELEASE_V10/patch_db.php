<?php
// patch_db.php
require_once 'config/db.php';

try {
    $sql = file_get_contents('patch_v10.sql');
    $conn->exec($sql);
    echo "✅ Database patched successfully: course_assignments table created.";
} catch (PDOException $e) {
    echo "❌ Error patching database: " . $e->getMessage();
}
?>
