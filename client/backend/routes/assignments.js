const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// @desc    Get assignments for a user
// @route   GET /api/assignments?user_id=123
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID required' });
        }

        const query = `
            SELECT ca.*, c.title as course_title, c.thumbnail 
            FROM course_assignments ca 
            JOIN courses c ON ca.course_id = c.id 
            WHERE ca.user_id = ? 
            AND (ca.expires_at IS NULL OR ca.expires_at > NOW())
            ORDER BY ca.assigned_at DESC
        `;

        const [rows] = await pool.execute(query, [user_id]);

        // Map _id for frontend compatibility if needed, though frontend uses 'id' mostly for assignments now?
        // Let's stick to standard SQL columns but ensure we send Dates correctly
        res.json({ success: true, data: rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Assign course to user
// @route   POST /api/assignments
router.post('/', async (req, res) => {
    try {
        const { user_id, course_id, expires_at } = req.body;

        if (!user_id || !course_id) {
            return res.status(400).json({ success: false, message: 'Missing user_id or course_id' });
        }

        // Check if exists
        const [existing] = await pool.execute(
            'SELECT id FROM course_assignments WHERE user_id = ? AND course_id = ?',
            [user_id, course_id]
        );

        const expiry = expires_at || null;

        if (existing.length > 0) {
            // Update
            await pool.execute(
                'UPDATE course_assignments SET expires_at = ? WHERE user_id = ? AND course_id = ?',
                [expiry, user_id, course_id]
            );
            res.json({ success: true, message: 'Assignment updated' });
        } else {
            // Create
            await pool.execute(
                'INSERT INTO course_assignments (user_id, course_id, expires_at) VALUES (?, ?, ?)',
                [user_id, course_id, expiry]
            );
            res.json({ success: true, message: 'Course assigned successfully' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Revoke assignment
// @route   DELETE /api/assignments
router.delete('/', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Assignment ID required' });
        }

        await pool.execute('DELETE FROM course_assignments WHERE id = ?', [id]);
        res.json({ success: true, message: 'Assignment revoked' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
