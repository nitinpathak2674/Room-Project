const db = require('../config/db');

exports.getRooms = async (req, res) => {
    const [rooms] = await db.execute('SELECT * FROM Rooms');
    res.json(rooms);
};

exports.createBooking = async (req, res) => {
    const { room_id, start_date, end_date } = req.body;
    const user_id = req.user.id;
    try {
        const [overlap] = await db.execute(
            `SELECT * FROM Bookings WHERE room_id = ? AND (start_date < ? AND end_date > ?)`,
            [room_id, end_date, start_date]
        );
        if (overlap.length > 0) return res.status(400).json({ message: "Room already booked for these dates!" });
        await db.execute('INSERT INTO Bookings (user_id, room_id, start_date, end_date) VALUES (?, ?, ?, ?)', 
            [user_id, room_id, start_date, end_date]);
        res.status(201).json({ message: "Booking successful!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};