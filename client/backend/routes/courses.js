const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const [courses] = await pool.execute('SELECT * FROM courses ORDER BY created_at DESC');

        // Fetch counts for each course
        // Optimization: Could do a JOIN and GROUP BY, but loop is simpler for parity with PHP logic for now
        for (let course of courses) {
            const [countRows] = await pool.execute('SELECT COUNT(*) as count FROM course_materials WHERE course_id = ?', [course.id]);
            course.content_count = countRows[0].count;
            course._id = course.id; // Compatibility
            course.createdAt = course.created_at;
        }

        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [req.params.id]);
        const course = rows[0];

        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }

        const [content] = await pool.execute('SELECT * FROM course_materials WHERE course_id = ? ORDER BY id ASC', [req.params.id]);

        course.content = content;
        course._id = course.id;
        course.createdAt = course.created_at;

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
router.post('/', async (req, res) => {
    try {
        const { title, description, category, price } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, error: 'Please add a course title' });
        }

        const [result] = await pool.execute(
            'INSERT INTO courses (title, description, category, price) VALUES (?, ?, ?, ?)',
            [title, description || '', category || 'GPAT', price || 0]
        );

        res.status(201).json({
            success: true,
            data: {
                _id: result.insertId,
                id: result.insertId,
                title,
                description: description || '',
                category: category || 'GPAT',
                price: price || 0,
                content: []
            }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// @desc    Update Course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    const connection = await pool.getConnection(); // Need transaction
    try {
        await connection.beginTransaction();

        const id = req.params.id;
        const { title, description, category, price, content } = req.body;

        // 1. Update Course Fields
        const updateFields = [];
        const updateValues = [];

        if (title !== undefined) { updateFields.push('title = ?'); updateValues.push(title); }
        if (description !== undefined) { updateFields.push('description = ?'); updateValues.push(description); }
        if (category !== undefined) { updateFields.push('category = ?'); updateValues.push(category); }
        if (price !== undefined) { updateFields.push('price = ?'); updateValues.push(price); }

        if (updateFields.length > 0) {
            updateValues.push(id);
            await connection.execute(`UPDATE courses SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
        }

        // 2. Update Content
        if (content && Array.isArray(content)) {
            // Delete existing
            await connection.execute('DELETE FROM course_materials WHERE course_id = ?', [id]);

            // Insert new
            const insertQuery = 'INSERT INTO course_materials (course_id, title, type, url, folder, is_free) VALUES (?, ?, ?, ?, ?, ?)';

            for (const item of content) {
                await connection.execute(insertQuery, [
                    id,
                    item.title,
                    item.type,
                    item.url,
                    item.folder || null,
                    item.is_free ? 1 : 0
                ]);
            }
        }

        await connection.commit();

        // Fetch updated to return
        // Simplify: Return what was sent + ID, or fetch fresh?
        // Fetching fresh is safer
        const [rows] = await connection.execute('SELECT * FROM courses WHERE id = ?', [id]);
        const updatedCourse = rows[0];
        updatedCourse._id = updatedCourse.id;

        res.status(200).json({ success: true, data: updatedCourse });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    } finally {
        connection.release();
    }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await pool.execute('DELETE FROM courses WHERE id = ?', [req.params.id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ success: true, data: {} });
        } else {
            res.status(404).json({ success: false, error: 'Course not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
