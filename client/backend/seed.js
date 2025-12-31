const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI?.replace('localhost', '127.0.0.1') || 'mongodb://127.0.0.1:27017/lakshya')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedAdmin = async () => {
    try {
        const email = 'shoaib.ss300@gmail.com';
        const password = 'Shaikh@#$001';

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Admin user already exists. Updating password/role...');

            // Hash new password just in case it changed
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            userExists.password = hashedPassword;
            userExists.role = 'admin';
            userExists.name = 'Shoaib Admin';
            await userExists.save();
            console.log('Admin user updated successfully');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create({
                name: 'Shoaib Admin',
                email: email,
                password: hashedPassword,
                role: 'admin',
                phone: '0000000000'
            });
            console.log('Admin user created successfully');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
