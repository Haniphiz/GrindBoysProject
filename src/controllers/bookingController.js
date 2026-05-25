const db = require('../config/db');

// 🔍 GET Riwayat Booking berdasarkan User Login (VERSI BERSIH & AMAN)
const getBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Kita ambil murni dari tabel bookings saja tanpa JOIN ke payments dulu
    const [results] = await db.query(
      `SELECT id AS booking_id, room_id, total_price 
       FROM bookings 
       WHERE user_id = ?`,
      [user_id]
    );

    res.json({
      status: "success",
      message: "Berhasil mengambil riwayat pemesanan",
      data: results
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server saat mengambil riwayat"
    });
  }
};

// ➕ POST booking baru (VERSI MINIMALIS AMAN)
const addBooking = async (req, res) => {
  try {
    const { room_id } = req.body; 
    const user_id = req.user.id;

    if (!room_id) {
      return res.status(400).json({
        status: "error",
        message: "room_id wajib diisi"
      });
    }

    const [room] = await db.query("SELECT * FROM rooms WHERE id = ?", [room_id]);
    if (room.length === 0) {
      return res.status(404).json({ status: "error", message: "Room tidak ditemukan" });
    }
    const total_price = room[0].price;

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, room_id, total_price) VALUES (?, ?, ?)`,
      [user_id, room_id, total_price]
    );

    res.status(201).json({
      status: "success",
      message: "Booking berhasil ditambahkan",
      data: { booking_id: result.insertId, total_price }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan server" });
  }
};

module.exports = { getBookings, addBooking };