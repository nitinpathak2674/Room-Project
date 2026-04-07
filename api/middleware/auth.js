const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const protect = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
        // Hardcoded string ki jagah process.env use karo
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_super_secret_key_123'); 
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Token is not valid" });
    }
};

module.exports = { protect };