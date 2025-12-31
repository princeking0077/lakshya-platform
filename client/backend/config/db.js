const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_USER', 'DB_PASS', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('CRITICAL: Missing required environment variables:', missingVars.join(', '));
    console.error('Please set these in Hostinger cPanel → Environment Variables');
}

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log('Database Configuration:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    // Never log password
});

const pool = mysql.createPool(dbConfig);

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✓ MySQL Database Connected Successfully');
        console.log('  Host:', dbConfig.host);
        console.log('  Database:', dbConfig.database);
        connection.release();
    } catch (error) {
        console.error('✗ MySQL Connection Failed:', error.message);
        console.error('  Host:', dbConfig.host);
        console.error('  User:', dbConfig.user);
        console.error('  Database:', dbConfig.database);
        console.error('  Check your Hostinger environment variables!');
        // Don't exit - let server run so /health endpoint works
    }
};

module.exports = { pool, connectDB };
