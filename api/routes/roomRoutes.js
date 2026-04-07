const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ success: true, message: "Registered!" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Email already exists" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            const isMatch = await bcrypt.compare(password, users[0].password);
            if (isMatch) {
                res.json({ success: true, user: { id: users[0].id, name: users[0].name } });
            } else {
                res.status(401).json({ success: false, error: "Invalid password" });
            }
        } else {
            res.status(404).json({ success: false, error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: "Login failed" });
    }
});

module.exports = router; 