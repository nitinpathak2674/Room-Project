const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.post('/add', async (req, res) => {
    const { userId, roomId, startDate, endDate } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [overlap] = await connection.query(
            "SELECT * FROM bookings WHERE room_id = ? AND status = 'Confirmed' AND NOT (end_date <= ? OR start_date >= ?)",
            [roomId, startDate, endDate]
        );
        if (overlap.length > 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, error: "Room already booked!" });
        }
        await connection.query(
            "INSERT INTO bookings (user_id, room_id, start_date, end_date, status) VALUES (?, ?, ?, ?, 'Confirmed')",
            [userId, roomId, startDate, endDate]
        );
        await connection.commit();
        res.status(201).json({ success: true, message: "Booking confirmed!" });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ success: false, error: "Transaction failed" });
    } finally {
        connection.release();
    }
});


router.get('/user/:userId', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT b.*, r.name as room_name FROM bookings b 
             JOIN rooms r ON b.room_id = r.id 
             WHERE b.user_id = ? ORDER BY b.start_date DESC`, 
            [req.params.userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 