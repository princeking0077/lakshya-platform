const express = require('express');
const router = express.Router();
const initDB = require('../init_db');

// @desc    Run Database Setup
// @route   GET /api/sys-setup
// @access  Public (Should be protected in prod, but temporary for now)
router.get('/', async (req, res) => {
    try {
        await initDB();
        res.status(200).json({ success: true, message: 'Database Initialized and Admin Created!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Setup Failed: ' + error.message });
    }
});

module.exports = router;
