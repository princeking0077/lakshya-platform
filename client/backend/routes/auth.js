const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        // Check if user exists
        const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role, phone, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, 'student', phone || '', 0] // Default role student, pending approval
        );

        if (result.insertId) {
            res.status(201).json({
                success: true,
                message: 'Registration successful. Please wait for Admin approval.',
                data: {
                    _id: result.insertId,
                    name,
                    email,
                    role: 'student',
                    is_approved: 0
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user email
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {

            // CHECK APPROVAL (Only for Students)
            if (user.role === 'student' && user.is_approved == 0) {
                return res.status(200).json({ // Return 200 with success: false to match PHP behavior if needed, or 403
                    success: false,
                    message: "Account pending approval from Admin."
                });
            }

            res.json({
                success: true,
                token: generateToken(user.id, user.role),
                data: {
                    _id: user.id, // Keeping _id for Frontend compatibility
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
router.get('/me', async (req, res) => {
    // Placeholder, needs middleware
    res.json({ message: 'Me endpoint' });
});

module.exports = router;
