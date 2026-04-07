const db = require('./config/db');
const bcrypt = require('bcrypt'); 

const cleanAndFix = async () => {
    try {
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

        await db.query("DELETE FROM bookings");
        await db.query("DELETE FROM users");
        await db.query("DELETE FROM rooms");

        await db.query(`
            INSERT INTO rooms (id, name, price_per_night) VALUES 
            (1, 'Deluxe Suite', 2500),
            (2, 'Standard Room', 1500),
            (3, 'Executive Suite', 5000)
        `);

        const dummyPassword = 'password123';
        const hashedPassword = await bcrypt.hash(dummyPassword, 10);
        
        await db.query(`
            INSERT INTO users (id, name, email, password) VALUES 
            (1, 'Test Admin', 'admin@test.com', ?)
        `, [hashedPassword]);

        console.log("Database Ready!");
        process.exit();
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
};

cleanAndFix();