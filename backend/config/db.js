const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "booking_hotel"
});

db.connect(err => {
  if (err) {
    console.error("Koneksi gagal:", err);
  } else {
    console.log("Koneksi database berhasil");
  }
});

module.exports = db;
