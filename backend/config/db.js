const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // sesuaikan dengan konfigurasi MySQL kamu
  database: 'bookinghotel'
});

conn.connect(err => {
  if (err) throw err;
  console.log("✅ Koneksi ke bookinghotel berhasil!");
});

module.exports = conn;
