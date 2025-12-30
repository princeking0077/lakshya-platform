const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

const initDB = async () => {
    try {
        console.log('Initializing Database...');
        const connection = await pool.getConnection();

        // 1. Users Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'student') DEFAULT 'student',
                phone VARCHAR(20),
                is_approved TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // 2. Courses Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100) DEFAULT 'GPAT',
                price DECIMAL(10, 2) DEFAULT 0.00,
                thumbnail VARCHAR(255) DEFAULT 'no-photo.jpg',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Course Materials Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS course_materials (
                id INT AUTO_INCREMENT PRIMARY KEY,
                course_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                type ENUM('video', 'note', 'live') NOT NULL,
                url VARCHAR(500) NOT NULL,
                folder VARCHAR(100),
                is_free TINYINT(1) DEFAULT 0,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
            )
        `);

        // 4. Tests Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS tests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                duration INT DEFAULT 180,
                total_marks INT DEFAULT 0,
                negative_marks FLOAT DEFAULT 1.0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 5. Questions Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS questions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                test_id INT NOT NULL,
                question_text TEXT NOT NULL,
                option_1 TEXT,
                option_2 TEXT,
                option_3 TEXT,
                option_4 TEXT,
                correct_option INT NOT NULL,
                marks INT DEFAULT 4,
                FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
            )
        `);

        // 6. Results Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                test_id INT NOT NULL,
                score INT DEFAULT 0,
                total_questions INT DEFAULT 0,
                correct_answers INT DEFAULT 0,
                wrong_answers INT DEFAULT 0,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
            )
        `);

        // 7. Course Assignments Table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS course_assignments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                course_id INT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at DATE NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
            )
        `);

        // 8. Seed Admin
        const email = 'shoaib.ss300@gmail.com';
        const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            console.log('Seeding Admin User...');
            const password = 'Shaikh@#$001';
            const hashedPassword = await bcrypt.hash(password, 10);
            await connection.execute(
                'INSERT INTO users (name, email, password, role, is_approved, phone) VALUES (?, ?, ?, ?, ?, ?)',
                ['Shoaib Admin', email, hashedPassword, 'admin', 1, '0000000000']
            );
            console.log('Admin User Created.');
        } else {
            console.log('Admin User already exists.');
        }

        connection.release();
        console.log('Database Initialization Complete.');
        return true;
    } catch (error) {
        console.error('Database Initialization Failed:', error);
        throw error;
    }
};

// Check if running directly
if (require.main === module) {
    initDB().then(() => process.exit(0)).catch(() => process.exit(1));
} else {
    module.exports = initDB;
}
