const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserModel }  = require('../model/User')
const { pool } = require('../database/DataBaseConfiguration'); // Import pool
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
    const { email, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Log user details for debugging
      console.log('User fetched from DB:', user);
  
      // Compare the plain text password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password comparison:', isPasswordValid); // Log comparison result
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '5h' });
  
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  
module.exports = {
    registerUser,
    loginUser
};
