const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const email = 'shoaib.ss300@gmail.com';
        const password = 'Shaikh@#$001';
        const name = 'Shoaib Admin';
        const phone = '0000000000';

        console.log('Checking for existing Admin...');

        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log('Admin user already exists.');
            // Optional: Update password if needed
            // const hashedPassword = await bcrypt.hash(password, 10);
            // await pool.execute('UPDATE users SET password = ?, role = "admin" WHERE email = ?', [hashedPassword, email]);
            // console.log('Admin password/role updated.');
        } else {
            console.log('Creating Admin user...');
            const hashedPassword = await bcrypt.hash(password, 10);

            await pool.execute(
                'INSERT INTO users (name, email, password, role, phone, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, hashedPassword, 'admin', phone, 1]
            );
            console.log('Admin user created successfully.');
        }

        console.log('Credentials:');
        console.log('Email:', email);
        console.log('Password:', password);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
