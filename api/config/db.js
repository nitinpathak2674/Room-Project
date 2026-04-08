const mysql = require('mysql2/promise');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 27321,
    ssl: { rejectUnauthorized: false },
    connectTimeout: 30000 
};

const db = {
    query: async (sql, params) => {
        // Har baar naya connection banega
        const connection = await mysql.createConnection(dbConfig);
        try {
            const [results] = await connection.execute(sql, params);
            return [results];
        } catch (err) {
            console.error("DB Error FULL:", err);
            throw err;
        } finally {
            // Kaam khatam hote hi connection band (Vercel ke liye Best)
            await connection.end(); 
        }
    }
};

module.exports = db;