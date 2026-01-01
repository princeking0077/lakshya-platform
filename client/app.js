const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./backend/config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('=== Express Server Starting ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);

// Trust proxy for Hostinger
app.set('trust proxy', true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection (non-blocking)
connectDB().catch(err => {
    console.warn('Database connection failed, but server will continue:', err.message);
});

// Serve static files from Next.js build (out directory)
app.use(express.static(path.join(__dirname, 'out')));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'backend/public/uploads')));

// API Routes
let startupError = null;
try {
    // DB Setup Route
    const initDB = require('./backend/init_db');
    app.get('/api/setup-db', async (req, res) => {
        try {
            await initDB();
            res.status(200).json({ success: true, message: 'Database Initialized Successfully!' });
        } catch (error) {
            console.error('Setup error:', error);
            res.status(500).json({ success: false, message: 'Setup Failed: ' + error.message });
        }
    });

    // Backend API routes
    app.use('/api/auth', require('./backend/routes/auth'));
    app.use('/api/users', require('./backend/routes/users'));
    app.use('/api/courses', require('./backend/routes/courses'));
    app.use('/api/tests', require('./backend/routes/tests'));
    app.use('/api/results', require('./backend/routes/results'));
    app.use('/api/upload', require('./backend/routes/upload'));
    app.use('/api/assignments', require('./backend/routes/assignments'));
    app.use('/api/dashboard', require('./backend/routes/dashboard'));
    app.use('/health', require('./backend/routes/health'));

    console.log('✓ All API routes loaded successfully');
} catch (err) {
    console.error('✗ API routes loading failed:', err.message);
    startupError = err.message + "\n" + err.stack;
}

// Debug endpoint
app.get('/api/debug-server', (req, res) => {
    const fs = require('fs');
    const outPath = path.join(__dirname, 'out');
    const adminPath = path.join(outPath, 'admin', 'index.html');

    res.json({
        status: 'express-static-server-active',
        environment: process.env.NODE_ENV || 'development',
        cwd: process.cwd(),
        startupError: startupError,
        envVars: {
            DB_HOST: process.env.DB_HOST || 'NOT_SET',
            DB_USER: process.env.DB_USER ? 'SET' : 'NOT_SET',
            DB_PASS: process.env.DB_PASS ? 'SET' : 'NOT_SET',
            DB_NAME: process.env.DB_NAME ? 'SET' : 'NOT_SET',
            JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
            PORT: process.env.PORT || 'NOT_SET'
        },
        paths: {
            out: outPath,
            outExists: fs.existsSync(outPath),
            adminHtml: adminPath,
            adminExists: fs.existsSync(adminPath),
            outFiles: fs.existsSync(outPath) ? fs.readdirSync(outPath).slice(0, 20) : []
        },
        uptime: process.uptime(),
        nodeVersion: process.version
    });
});

// Debug query endpoint (for testing database)
app.post('/api/debug-query', async (req, res) => {
    try {
        const { query } = req.body;

        // Security: Only allow SELECT queries
        if (!query || typeof query !== 'string' || !query.trim().toLowerCase().startsWith('select')) {
            return res.status(400).json({
                success: false,
                message: 'Only SELECT queries are allowed for security'
            });
        }

        const { pool } = require('./backend/config/db');
        const [rows] = await pool.execute(query);

        res.json({
            success: true,
            rowCount: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error.toString()
        });
    }
});

// Serve Next.js static pages - fallback to index.html for client-side routing
app.get('/*', (req, res) => {
    // Check if file exists in out directory
    const filePath = path.join(__dirname, 'out', req.path);
    const htmlPath = path.join(__dirname, 'out', req.path + '.html');
    const indexPath = path.join(__dirname, 'out', req.path, 'index.html');

    const fs = require('fs');

    if (fs.existsSync(htmlPath)) {
        res.sendFile(htmlPath);
    } else if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Fallback to 404 or index
        const notFoundPath = path.join(__dirname, 'out', '404.html');
        if (fs.existsSync(notFoundPath)) {
            res.status(404).sendFile(notFoundPath);
        } else {
            res.status(404).send('Page not found');
        }
    }
});

// Start server
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`✓ Server running on port ${PORT}`);
    console.log(`✓ Serving static files from: ${path.join(__dirname, 'out')}`);
    console.log(`✓ API endpoints available at: /api/*`);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});
