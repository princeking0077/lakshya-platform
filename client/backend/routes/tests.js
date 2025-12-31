const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// @desc    Get all tests
// @route   GET /api/tests
router.get('/', async (req, res) => {
    try {
        const [tests] = await pool.execute('SELECT * FROM tests ORDER BY created_at DESC');

        for (let test of tests) {
            const [qCount] = await pool.execute('SELECT COUNT(*) as count FROM questions WHERE test_id = ?', [test.id]);
            const count = qCount[0].count;

            test._id = test.id;
            // Dummy questions array for length check in frontend (Fixed in V12, but good for backward compat)
            test.questions = new Array(count).fill(null);
        }

        res.json({ success: true, data: tests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Create Test
// @route   POST /api/tests
router.post('/', async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { title, duration, totalMarks, negativeMarks, questions } = req.body;

        if (!title) {
            throw new Error("Title is required");
        }

        // Insert Test
        const [result] = await connection.execute(
            'INSERT INTO tests (title, duration, total_marks, negative_marks) VALUES (?, ?, ?, ?)',
            [title, duration || 180, totalMarks || 0, negativeMarks || 1.0]
        );

        const testId = result.insertId;

        // Insert Questions
        if (questions && Array.isArray(questions)) {
            const qSql = 'INSERT INTO questions (test_id, question_text, option_1, option_2, option_3, option_4, correct_option, marks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

            for (const q of questions) {
                await connection.execute(qSql, [
                    testId,
                    q.questionText,
                    q.options[0],
                    q.options[1],
                    q.options[2],
                    q.options[3],
                    q.correctOption,
                    q.marks || 4
                ]);
            }
        }

        await connection.commit();
        res.json({ success: true, data: { _id: testId } });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
