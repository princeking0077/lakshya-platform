const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
// Adjust path: index.js is in 'server', routes in 'server/routes'. 
// uploadDir relative to routes: ../public/uploads
// Check index.js: `app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));`
// So it expects `server/public/uploads`.
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
    if (req.file) {
        // Return URL accessible by frontend
        const url = `/uploads/${req.file.filename}`;
        res.json({ success: true, data: url });
    } else {
        res.status(400).json({ success: false, message: 'Upload failed' });
    }
});

module.exports = router;
