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

// ➕ POST booking baru
const addBooking = async (req, res) => {
  try {
    const { room_id, total_price } = req.body;
    const user_id = req.user.id;

    if (!room_id) {
      return res.status(400).json({
        status: "error",
        message: "room_id wajib diisi"
      });
    }

    // Ambil total_price dari frontend
    // (karena kamar di-generate di frontend, bukan dari tabel rooms)
    const finalPrice = total_price || 0;

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, room_id, total_price) VALUES (?, ?, ?)`,
      [user_id, room_id, finalPrice]
    );

    res.status(201).json({
      status: "success",
      message: "Booking berhasil ditambahkan",
      data: { booking_id: result.insertId, total_price: finalPrice }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan server" });
  }
};

// ✅ COMPLETE BOOKING / CHECKOUT
const completeBooking = async (req, res) => {
  try {

    const booking_id = req.params.id;
    const user_id = req.user.id;

    const [bookingRows] = await db.query(
      `
      SELECT *
      FROM bookings
      WHERE id = ?
      AND user_id = ?
      `,
      [booking_id, user_id]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan"
      });
    }

    const booking = bookingRows[0];

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        status: "error",
        message: "Hanya booking berstatus confirmed yang dapat diselesaikan"
      });
    }

    await db.query(
      `
      UPDATE bookings
      SET status = 'completed'
      WHERE id = ?
      `,
      [booking_id]
    );

    res.json({
      status: "success",
      message: "Booking berhasil diselesaikan",
      data: {
        booking_id,
        old_status: "confirmed",
        new_status: "completed"
      }
    });

  } catch (error) {

    console.error("COMPLETE BOOKING ERROR:", error);

    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

module.exports = {
  getBookings,
  addBooking,
  completeBooking
};


