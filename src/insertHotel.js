const conn = require('./config/db');

const hotel = {
  name: "Hotel Bintang Lima",
  address: "Jl. Sudirman No. 1",
  city: "Jakarta",
  description: "Hotel mewah dengan fasilitas lengkap",
  image_url: "https://example.com/hotel.jpg",
  created_at: new Date()
};

conn.query("INSERT INTO hotels SET ?", hotel, (err, result) => {
  if (err) throw err;
  console.log("Hotel berhasil ditambahkan dengan ID:", result.insertId);
  conn.end();
});
