const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { registerUser, loginUser } = require("../controller/AuthController");

const JWT_SECRET = '2acbd9bc00c26ce1bf2c777a23167a89e133b18b816780403a8ba69a0d065859';

// Auth Middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        token = token.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

