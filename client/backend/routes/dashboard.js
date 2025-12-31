const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Admin
router.get('/', async (req, res) => {
    try {
        // Get total students (approved only)
        const [studentRows] = await pool.execute(
            "SELECT COUNT(*) as count FROM users WHERE role = 'student' AND is_approved = 1"
        );

        // Get total courses
        const [courseRows] = await pool.execute(
            "SELECT COUNT(*) as count FROM courses"
        );

        // Get total tests
        const [testRows] = await pool.execute(
            "SELECT COUNT(*) as count FROM tests"
        );

        // Get total test results
        const [resultRows] = await pool.execute(
            "SELECT COUNT(*) as count FROM results"
        );

        // Get recent users (last 5)
        const [recentUsers] = await pool.execute(
            "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5"
        );

        res.json({
            success: true,
            stats: {
                students: studentRows[0].count,
                courses: courseRows[0].count,
                tests: testRows[0].count,
                results: resultRows[0].count
            },
            recent_users: recentUsers
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            stats: { students: 0, courses: 0, tests: 0, results: 0 },
            recent_users: []
        });
    }
});

module.exports = router;
