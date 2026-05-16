const db = require('./config/db');
const bcrypt = require('bcrypt');

const cleanAndFix = async () => {
    try {
        // Create tables if they don't exist (safe)
        await db.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price_per_night DECIMAL(10,2) NOT NULL
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            room_id INT,
            start_date DATE,
            end_date DATE,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (room_id) REFERENCES rooms(id)
        )`);

        // Insert rooms if not already there
        await db.query(`
            INSERT INTO rooms (name, price_per_night)
            SELECT * FROM (SELECT 'Deluxe Suite', 2500) AS tmp
            WHERE NOT EXISTS (SELECT name FROM rooms WHERE name='Deluxe Suite') LIMIT 1
        `);
        await db.query(`
            INSERT INTO rooms (name, price_per_night)
            SELECT * FROM (SELECT 'Standard Room', 1500) AS tmp
            WHERE NOT EXISTS (SELECT name FROM rooms WHERE name='Standard Room') LIMIT 1
        `);
        await db.query(`
            INSERT INTO rooms (name, price_per_night)
            SELECT * FROM (SELECT 'Executive Suite', 5000) AS tmp
            WHERE NOT EXISTS (SELECT name FROM rooms WHERE name='Executive Suite') LIMIT 1
        `);

        console.log("Rooms seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

cleanAndFix();