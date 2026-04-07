const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_123';


router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Registration failed" });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                error: "Please enter both email and password" 
            });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length > 0) {
            const isMatch = await bcrypt.compare(password, users[0].password);
            
            if (isMatch) {
              
                const token = jwt.sign(
                    { id: users[0].id, email: users[0].email }, 
                    JWT_SECRET, 
                    { expiresIn: '2h' }
                );

                res.json({ 
                    success: true,
                    token: token,
                    user: { id: users[0].id, name: users[0].name, email: users[0].email } 
                });
            } else {
                
                res.status(401).json({ success: false, error: "Invalid password. Please try again." });
            }
        } else {
          
            res.status(404).json({ success: false, error: "User not found. Please register first." });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: "Database error" });
    }
});

module.exports = router;