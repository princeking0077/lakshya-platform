const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

// Force IPv4 loopback to avoid Windows IPv6 issues
const uri = process.env.MONGO_URI?.replace('localhost', '127.0.0.1') || 'mongodb://127.0.0.1:27017/lakshya';

console.log('Attempting to connect to:', uri);

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000 // Fail fast if no connection
})
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error('Connection Failed:', err.message);
        process.exit(1);
    });

const seedAdmin = async () => {
    try {
        const email = 'shoaib.ss300@gmail.com';
        const password = 'Shaikh@#$001';

        const userExists = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (userExists) {
            userExists.password = hashedPassword;
            userExists.role = 'admin';
            userExists.name = 'Shoaib Admin';
            await userExists.save();
            console.log('Admin user updated successfully');
        } else {
            await User.create({
                name: 'Shoaib Admin',
                email: email,
                password: hashedPassword,
                role: 'admin',
                phone: '0000000000'
            });
            console.log('Admin user created successfully');
        }

        console.log('Seeding Complete');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

mongoose.connection.once('open', seedAdmin);
