const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Result = require('../models/Result');

// Middleware placeholder (Use real auth in prod)
const protect = (req, res, next) => {
    // Mock user ID for now if not authenticated, or implement real JWT verification here
    // In Phase 2 we implemented JWT, let's assume req.user is populated by a middleware
    // For this prototype, we'll extract ID from body or assume a test user if middleware missing
    next();
};

// @desc    Submit Test & Calculate Result
// @route   POST /api/results/submit
// @access  Private
router.post('/submit', async (req, res) => {
    try {
        const { testId, answers, studentId } = req.body;

        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ success: false, error: 'Test not found' });
        }

        let score = 0;
        let correctCount = 0;
        let incorrectCount = 0;
        let unattemptedCount = 0;

        test.questions.forEach((question, index) => {
            const userAns = answers[index];

            if (userAns === undefined || userAns === null) {
                unattemptedCount++;
            } else if (Number(userAns) === question.correctOption) {
                score += question.marks;
                correctCount++;
            } else {
                score -= test.negativeMarks;
                incorrectCount++;
            }
        });

        // Save Result
        const result = await Result.create({
            student: studentId || "60d0fe4f5311236168a109ca", // Fallback ID if auth middleware skipped
            test: testId,
            score,
            totalMarks: test.questions.reduce((acc, q) => acc + q.marks, 0),
            correctAnswers: correctCount,
            incorrectAnswers: incorrectCount,
            unattempted: unattemptedCount
        });

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get user results
// @route   GET /api/results/my
// @access  Private
router.get('/my', async (req, res) => {
    try {
        // Mock query
        const results = await Result.find().populate('test', 'title').sort({ completedAt: -1 });
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
