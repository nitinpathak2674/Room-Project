require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const db = require('./config/db');

const app = express();

// CORS ko thoda flexible rakho deployment ke liye
app.use(cors());
app.use(express.json());

// Routes
app.use('https://room-reserve-clean.onrender.com/api/auth', authRoutes);
app.use('https://room-reserve-clean.onrender.com/api/bookings', bookingRoutes);

// Test Route
app.get('https://room-reserve-clean.onrender.com/api/rooms', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM rooms');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get("/", (req, res) => res.send("Server is running perfectly!"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;