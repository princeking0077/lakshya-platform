const express = require('express');
const next = require('next');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./backend/config/db');

// Load environment variables
dotenv.config();

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

console.log('=== Server Starting ===');
console.log('Node Environment:', process.env.NODE_ENV);
console.log('Port:', PORT);
console.log('Dev Mode:', dev);

app.prepare().then(() => {
    console.log('Next.js prepared successfully');
    const server = express();

    // Trust Proxy (Hostinger)
    server.set('trust proxy', true);

    // Database Connection (non-blocking)
    connectDB().catch(err => {
        console.warn('Database connection failed, but server will continue:', err.message);
    });

    // Middleware
    server.use(cors());
    server.use(express.json());

    // Security Headers (Helmet) - loosen Content-Security-Policy for Next.js
    server.use(
        helmet({
            contentSecurityPolicy: false, // Let Next.js handle CSP if needed, or configure manually
            crossOriginEmbedderPolicy: false,
        })
    );

    // Serve 'uploads' directory from backend path
    server.use('/uploads', express.static(path.join(__dirname, 'backend/public/uploads')));

    // --- API ROUTES (Imported from backend folder) ---
    // Adjust paths to point to 'backend/routes/...'
    let startupError = null;

    // --- API ROUTES (Imported from backend folder) ---
    try {
        // DB Setup Route (MOVED OUTSIDE LOOP to ensure it registers even if others fail)
        const initDB = require('./backend/init_db');
        server.get('/setup-db', async (req, res) => {
            try {
                await initDB();
                res.status(200).json({ success: true, message: 'Database Initialized!' });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Setup Failed: ' + error.message });
            }
        });

        server.use('/api/auth', require('./backend/routes/auth'));
        server.use('/api/users', require('./backend/routes/users'));
        server.use('/api/courses', require('./backend/routes/courses'));
        server.use('/api/tests', require('./backend/routes/tests'));
        server.use('/api/results', require('./backend/routes/results'));
        server.use('/api/upload', require('./backend/routes/upload'));
        server.use('/api/assignments', require('./backend/routes/assignments'));
        server.use('/health', require('./backend/routes/health'));
    } catch (err) {
        console.warn("Warning: One or more API routes failed to load.", err.message);
        startupError = err.message + "\n" + err.stack;
    }

    // --- DEBUG ENDPOINT ---
    server.get('/api/debug-server', (req, res) => {
        res.json({
            status: 'hybrid-server-active',
            mode: dev ? 'development' : 'production',
            cwd: process.cwd(),
            startupError: startupError // SHOW ERROR TO USER
        });
    });

    // --- NEXT.JS HANDLER (Fallthrough for all other routes) ---
    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, '0.0.0.0', (err) => {
        if (err) {
            console.error('Failed to start server:', err);
            throw err;
        }
        console.log(`> Ready on port ${PORT} [Hybrid Express + Next.js]`);
        console.log(`> Server listening on http://0.0.0.0:${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to prepare Next.js:', err);
    process.exit(1);
});
