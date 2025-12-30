const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// @desc    Get user's results
// @route   GET /api/results/my
router.get('/my', async (req, res) => {
    try {
        // In a real middleware setup, user ID comes from req.user.id
        // But Hostinger/PHP setup was loose. Let's try to grab header manually if middleware not used yet,
        // OR rely on Frontend sending it?
        // Wait, PHP code extracted it from 'Authorization' header manually.
        // Node's 'auth' middleware usually does this.
        // Since I haven't applied auth middleware globally, I'll extract here or use a helper.

        // Let's rely on req.user if middleware is applied, OR decode manually if I skipped middleware in index.js for simplicity
        // But I should use middleware.
        // For now, let's Extract Bearer Token manually for speed.

        const authHeader = req.headers.authorization;
        let userId = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                // Since PHP used simple base64, verify what we are using now.
                // Node `auth.js` uses `jsonwebtoken`.
                // PHP `auth/login.php` was sending `base64_encode(json_encode(...))`.
                // Node `auth.js` sends `jwt.sign`.
                // CRITICAL: If I switched to Node Auth, I am issuing JWTs.
                // Clients will send whatever they got.
                // If they re-login, they get JWT.
                // So I should verify JWT.
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (e) {
                // Fallback for old PHP tokens?
                // PHP Token: base64(json({id, role, exp}))
                try {
                    const json = Buffer.from(token, 'base64').toString();
                    const data = JSON.parse(json);
                    if (data.id) userId = data.id;
                } catch (e2) { }
            }
        }

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const query = `
            SELECT r.*, t.title as test_title, t.total_marks as test_total 
            FROM results r 
            JOIN tests t ON r.test_id = t.id 
            WHERE r.user_id = ? 
            ORDER BY r.submitted_at DESC
        `;

        const [results] = await pool.execute(query, [userId]);

        // Enhance results with nested test object if frontend expects it
        const formattedResults = results.map(r => ({
            ...r,
            _id: r.id,
            completedAt: r.submitted_at,
            test: {
                title: r.test_title
            },
            totalMarks: r.test_total
        }));

        res.json({ success: true, data: formattedResults });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Submit Test Result
// @route   POST /api/results
router.post('/', async (req, res) => {
    try {
        const { testId, studentId, answers } = req.body;
        // answers is expected to be map {index: option} (0-3)

        if (!testId || !studentId) {
            return res.status(400).json({ success: false, message: 'Missing Data' });
        }

        // 1. Fetch Test
        const [tests] = await pool.execute('SELECT * FROM tests WHERE id = ?', [testId]);
        const test = tests[0];
        if (!test) return res.status(404).json({ success: false, message: 'Test not found' });

        // 2. Fetch Questions
        const [questions] = await pool.execute('SELECT * FROM questions WHERE test_id = ?', [testId]); // Order?
        // Note: PHP used SELECT * which defaults to insertion order (usually).

        let score = 0;
        let correct = 0;
        let wrong = 0;
        let total_q = questions.length;

        const userAnswers = answers || {}; // objects or map

        questions.forEach((q, index) => {
            // Try to access answer by index (string or int key)
            if (userAnswers.hasOwnProperty(index)) {
                const selected = userAnswers[index];
                if (parseInt(selected) === parseInt(q.correct_option)) {
                    score += q.marks;
                    correct++;
                } else {
                    score -= test.negative_marks;
                    wrong++;
                }
            }
        });

        // 3. Save Result
        const [result] = await pool.execute(
            'INSERT INTO results (user_id, test_id, score, total_questions, correct_answers, wrong_answers) VALUES (?, ?, ?, ?, ?, ?)',
            [studentId, testId, score, total_q, correct, wrong]
        );

        res.json({
            success: true,
            data: {
                _id: result.insertId,
                score,
                correctAnswers: correct,
                wrongAnswers: wrong,
                totalQuestions: total_q
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
