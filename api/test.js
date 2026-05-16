const db = require('./config/db');

async function test() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log('DB Connected', rows);
  } catch (err) {
    console.log(err);
  }
}

test();