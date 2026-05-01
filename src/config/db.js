const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'booking_hotel'
});

// Optional: test koneksi
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Koneksi database berhasil");
    connection.release();
  } catch (error) {
    console.error("Koneksi database gagal:", error);
  }
})();

module.exports = db;