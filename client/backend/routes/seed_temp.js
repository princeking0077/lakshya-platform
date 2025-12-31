const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
    try {
        const email = 'shoaib.ss300@gmail.com';
        const password = 'Shaikh@#$001';
        let user = await User.findOne({ email });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (user) {
            user.password = hashedPassword;
            user.role = 'admin';
            user.name = 'Shoaib Admin';
            await user.save();
            return res.send('Admin User Updated Successfully');
        }

        await User.create({
            name: 'Shoaib Admin',
            email,
            password: hashedPassword,
            role: 'admin',
            phone: '0000000000'
        });
        res.send('Admin User Created Successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
