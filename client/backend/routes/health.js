const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const fs = require('fs');
const path = require('path');

router.get('/', async (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        server: {
            running: true,
            port: process.env.PORT || 5000,
            nodeVersion: process.version,
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                unit: 'MB'
            }
        },
        database: {
            connected: false,
            responseTime: null,
            error: null
        },
        frontend: {
            built: false,
            indexExists: false,
            path: null
        }
    };

    // Check database connection
    try {
        const startTime = Date.now();
        const connection = await pool.getConnection();
        const responseTime = Date.now() - startTime;
        health.database.connected = true;
        health.database.responseTime = responseTime + 'ms';
        connection.release();
    } catch (error) {
        health.database.error = error.message;
        health.status = 'degraded';
    }

    // Check frontend build
    try {
        const clientBuildPath = path.join(__dirname, '../../out');
        const indexPath = path.join(clientBuildPath, 'index.html');

        health.frontend.path = clientBuildPath;
        health.frontend.built = fs.existsSync(clientBuildPath);
        health.frontend.indexExists = fs.existsSync(indexPath);

        if (!health.frontend.indexExists) {
            health.status = 'degraded';
        }
    } catch (error) {
        health.frontend.error = error.message;
        health.status = 'degraded';
    }

    // Determine overall status
    if (!health.database.connected && !health.frontend.indexExists) {
        health.status = 'failed';
        return res.status(503).json(health);
    }

    const statusCode = health.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(health);
});

module.exports = router;
