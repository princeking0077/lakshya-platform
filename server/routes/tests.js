const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Middleware placeholder
const adminOnly = (req, res, next) => next();

// @desc    Get all tests
// @route   GET /api/tests
// @access  Public
router.get('/', async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tests.length, data: tests });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get single test
// @route   GET /api/tests/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) return res.status(404).json({ success: false, error: 'Test not found' });
        res.status(200).json({ success: true, data: test });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create new test
// @route   POST /api/tests
// @access  Private/Admin
router.post('/', adminOnly, async (req, res) => {
    try {
        const test = await Test.create(req.body);
        res.status(201).json({ success: true, data: test });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Delete test
// @route   DELETE /api/tests/:id
// @access  Private/Admin
router.delete('/:id', adminOnly, async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ success: false, error: 'Test not found' });
        }
        await test.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
