const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

// @desc    Get all students
// @route   GET /api/users
router.get('/', async (req, res) => {
    try {
        const [users] = await pool.execute("SELECT id, name, email, role, phone, is_approved, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC");

        // Map keys
        const formattedUsers = users.map(u => ({
            ...u,
            _id: u.id,
            createdAt: u.created_at
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Create User (Admin)
// @route   POST /api/users
router.post('/', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = 'student';

        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, phone || '']
        );

        res.json({
            _id: result.insertId,
            name,
            email,
            phone: phone || ''
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Update User (Approval)
// @route   PUT /api/users/:id
router.put('/:id', async (req, res) => {
    try {
        const { is_approved } = req.body;
        const id = req.params.id;

        const newStatus = is_approved !== undefined ? is_approved : 1;

        await pool.execute('UPDATE users SET is_approved = ? WHERE id = ?', [newStatus, id]);

        res.json({ success: true, is_approved: newStatus });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Delete User
// @route   DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
