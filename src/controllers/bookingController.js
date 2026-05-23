const db = require('../config/db'); // pastikan ini sesuai config kamu

// 🔍 GET Riwayat Booking + Status Pembayaran berdasarkan User Login
const getBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    // 🔥 PERBAIKAN: check_in_date diganti jadi check_in, check_out_date diganti jadi check_out
    const [results] = await db.query(
      `SELECT 
        b.id AS booking_id,
        b.room_id,
        b.check_in,
        b.check_out,
        b.total_price,
        p.payment_status,
        p.payment_method
       FROM bookings b
       LEFT JOIN payments p ON b.id = p.booking_id
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

    // 🔍 Ambil data room untuk tahu harganya
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

    // 🔍 CEK APAKAH ROOM SUDAH DIBOOKING (🔥 PERBAIKAN: Menggunakan nama kolom check_in & check_out)
    const [existingBooking] = await db.query(
      `
      SELECT * FROM bookings
      WHERE room_id = ?
      AND (
        (check_in <= ? AND check_out >= ?)
        OR
        (check_in <= ? AND check_out >= ?)
        OR
        (check_in >= ? AND check_out <= ?)
      )
      `,
      [
        room_id,
        check_in, check_in,
        check_out, check_out,
        check_in, check_out
      ]
    );

    if (existingBooking.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Room sudah dibooking pada tanggal tersebut"
      });
    }

    // 💰 Hitung jumlah hari
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const total_price = days * price;

    // ➕ Insert booking baru (🔥 PERBAIKAN: Kolom diganti check_in & check_out)
    const [result] = await db.query(
      `INSERT INTO bookings 
       (user_id, room_id, check_in, check_out, total_price)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, room_id, check_in, check_out, total_price]
    );

    const newBookingId = result.insertId;

    // 💰 OTOMATIS BIKIN DATA PEMBAYARAN AWAL DENGAN STATUS 'Pending'
    await db.query(
      `INSERT INTO payments (booking_id, amount_paid, payment_method, payment_status)
       VALUES (?, ?, ?, ?)`,
      [newBookingId, total_price, 'Belum Memilih', 'Pending']
    );

    res.status(201).json({
      status: "success",
      message: "Booking berhasil ditambahkan, status pembayaran: Pending",
      data: {
        booking_id: newBookingId,
        room_id,
        check_in_date: check_in,
        check_out_date: check_out,
        total_price,
        payment_status: "Pending"
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

// ✅ EXPORT FUNCTION
module.exports = {
  getBookings,
  addBooking
};