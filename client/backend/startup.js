const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

console.log('=====================================');
console.log('   LAKSHYA PLATFORM - STARTUP');
console.log('=====================================');
console.log('Timestamp:', new Date().toISOString());
console.log('Node Version:', process.version);
console.log('Platform:', process.platform);
console.log('Working Directory:', process.cwd());
console.log('=====================================\n');

// Step 1: Validate Node.js version
logger.info('Step 1/5: Validating Node.js version');
const nodeVersion = process.version.replace('v', '').split('.');
const majorVersion = parseInt(nodeVersion[0]);
if (majorVersion < 16) {
    logger.error(`Node.js version ${process.version} is not supported. Requires >= 16.0.0`);
    process.exit(1);
}
logger.info(`✓ Node.js ${process.version} is compatible`);

// Step 2: Validate environment variables
logger.info('\nStep 2/5: Checking environment variables');
const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'JWT_SECRET'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    logger.error('Missing required environment variables:', { missing: missingVars });
    logger.error('Set these in Hostinger cPanel → Environment Variables');
    logger.warn('Continuing anyway, but expect database connection to fail...');
} else {
    logger.info('✓ All required environment variables are set');
    logger.info('  DB_HOST:', process.env.DB_HOST);
    logger.info('  DB_NAME:', process.env.DB_NAME);
    logger.info('  JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');
}

const port = process.env.PORT || 5000;
logger.info('  PORT:', port);

// Step 3: Validate critical directories
logger.info('\nStep 3/5: Checking critical directories');
const criticalDirs = [
    { name: 'client_build', path: path.join(__dirname, 'client_build') },
    { name: 'public/uploads', path: path.join(__dirname, 'public/uploads') },
];

let dirErrors = 0;
criticalDirs.forEach(dir => {
    if (fs.existsSync(dir.path)) {
        logger.info(`✓ ${dir.name} exists`);
    } else {
        logger.warn(`✗ ${dir.name} NOT FOUND at ${dir.path}`);
        if (dir.name === 'client_build') {
            dirErrors++;
        }
    }
});

// Step 4: Validate critical files
logger.info('\nStep 4/5: Checking critical files');
const indexHtmlPath = path.join(__dirname, 'client_build/index.html');
if (fs.existsSync(indexHtmlPath)) {
    logger.info('✓ Frontend built (index.html exists)');
} else {
    logger.error('✗ Frontend NOT built (index.html missing)');
    logger.error('  Expected at:', indexHtmlPath);
    logger.error('  Run: cd client && npm run build && copy output to server/client_build');
    dirErrors++;
}

if (dirErrors > 0) {
    logger.error(`\n${dirErrors} critical file(s) missing. Server may not work properly.`);
    logger.warn('Continuing anyway for diagnostic purposes...\n');
}

// Step 5: Start the main server
logger.info('\nStep 5/5: Starting Express server');
logger.info('Loading main application from index.js...\n');

try {
    require('./index.js');
    logger.info('Server startup sequence completed');
    logger.info('Check /health endpoint for detailed status');
} catch (error) {
    logger.error('FATAL: Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
}
