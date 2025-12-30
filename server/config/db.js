const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Database Connected Successfully');
        connection.release();
    } catch (error) {
        console.error('MySQL Connection Failed:', error.message);
        // process.exit(1);
    }
};

module.exports = { pool, connectDB };
