const jwt = require("jsonwebtoken");
const JWT_SECRET = '2acbd9bc00c26ce1bf2c777a23167a89e133b18b816780403a8ba69a0d065859';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;

        
        next();
    } catch (err) {
        console.log("Token verification error:",err)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;