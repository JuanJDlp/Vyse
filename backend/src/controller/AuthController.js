const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserModel }  = require('../model/User')
const { body, validationResult } = require('express-validator');
const JWT_SECRET = '2acbd9bc00c26ce1bf2c777a23167a89e133b18b816780403a8ba69a0d065859'

// Register User
const registerUser = async (req, res) => {
    await body('username').not().isEmpty().trim().escape().run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        let existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.createUser(username, email, hashedPassword, 'user');

        const payload = { userId: user.id , role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });

        res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Login User
const loginUser = async (req, res) => {
    await body('email').isEmail().normalizeEmail().run(req);
    await body('password').exists().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser
};
