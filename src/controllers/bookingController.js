const bookingModel = require('../models/bookingModel');
const db = require('../config/db'); // pastikan ini sesuai config kamu

// 🔍 GET booking berdasarkan user login
const getBookings = (req, res) => {
  const user_id = req.user.id;

  bookingModel.getBookingsByUser(user_id, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    res.json({
      status: "success",
      data: results
    });
  });
};

// ➕ POST booking
const addBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out } = req.body;
    const user_id = req.user.id;

    // 🔥 VALIDASI INPUT
    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({
        status: "error",
        message: "room_id, check_in, dan check_out wajib diisi"
      });
    }

    // 🔥 VALIDASI TANGGAL
    const start = new Date(check_in);
    const end = new Date(check_out);

    if (end <= start) {
      return res.status(400).json({
        status: "error",
        message: "check_out harus lebih besar dari check_in"
      });
    }

    // 🔍 Ambil data room
    const [room] = await db.query(
      "SELECT * FROM rooms WHERE id = ?",
      [room_id]
    );

    if (room.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Room tidak ditemukan"
      });
    }

    const price = room[0].price;

    // 💰 Hitung jumlah hari
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const total_price = days * price;

    // ➕ Insert booking
    const [result] = await db.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, room_id, check_in, check_out, total_price]
    );

    res.status(201).json({
      status: "success",
      message: "Booking berhasil ditambahkan",
      bookingId: result.insertId,
      total_price
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

// ✅ EXPORT WAJIB
module.exports = {
  getBookings,
  addBooking
};