// backend/controllers/bookingController.js

const db = require('../config/db');

// 🔍 GET Riwayat Booking berdasarkan User Login (dengan JOIN lengkap)
const getBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [results] = await db.query(
      `SELECT 
        b.id AS booking_id,
        b.room_id,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status,
        b.created_at,
        r.room_type,
        r.price AS price_per_night,
        r.capacity,
        h.id AS hotel_id,
        h.name AS hotel_name,
        h.city AS location,
        h.address,
        h.image_url
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN hotels h ON r.hotel_id = h.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
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
    const { room_id, total_price, check_in, check_out } = req.body;
    const user_id = req.user.id;

    if (!room_id) {
      return res.status(400).json({
        status: "error",
        message: "room_id wajib diisi"
      });
    }

    const finalPrice = total_price || 0;

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, room_id, total_price, check_in, check_out, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [user_id, room_id, finalPrice, check_in || null, check_out || null]
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

// ❌ CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const booking_id = req.params.id;
    const user_id = req.user.id;

    const [bookingRows] = await db.query(
      `SELECT * FROM bookings WHERE id = ? AND user_id = ?`,
      [booking_id, user_id]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan"
      });
    }

    const booking = bookingRows[0];

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        status: "error",
        message: `Booking berstatus ${booking.status} tidak dapat dibatalkan`
      });
    }

    await db.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
      [booking_id]
    );

    res.json({
      status: "success",
      message: "Booking berhasil dibatalkan",
      data: { booking_id, new_status: "cancelled" }
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

// ✅ COMPLETE BOOKING / CHECKOUT
const completeBooking = async (req, res) => {
  try {
    const booking_id = req.params.id;
    const user_id = req.user.id;

    const [bookingRows] = await db.query(
      `SELECT * FROM bookings WHERE id = ? AND user_id = ?`,
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
      `UPDATE bookings SET status = 'completed' WHERE id = ?`,
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
  cancelBooking,
  completeBooking
};