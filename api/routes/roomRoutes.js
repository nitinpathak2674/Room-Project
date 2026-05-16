const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const [rooms] = await db.query('SELECT * FROM rooms');
        res.json(rooms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

module.exports = router;