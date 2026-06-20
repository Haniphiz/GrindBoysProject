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
<<<<<<< HEAD
    const { room_id, total_price, check_in, check_out, guests, special_request } = req.body;
=======
    const { room_id, total_price, check_in, check_out } = req.body;
>>>>>>> 459e131ca4330585254e6f5e7ff5a98e3301e2a8
    const user_id = req.user.id;

    if (!room_id) {
      return res.status(400).json({
        status: "error",
        message: "room_id wajib diisi"
      });
    }

    const finalPrice = total_price || 0;

    const [result] = await db.query(
<<<<<<< HEAD
      `INSERT INTO bookings (user_id, room_id, total_price, check_in, check_out, guests, special_request) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, room_id, finalPrice, check_in, check_out, guests || 1, special_request || null]
=======
      `INSERT INTO bookings (user_id, room_id, total_price, check_in, check_out, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [user_id, room_id, finalPrice, check_in || null, check_out || null]
>>>>>>> 459e131ca4330585254e6f5e7ff5a98e3301e2a8
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

<<<<<<< HEAD
// ✅ COMPLETE BOOKING / CHECKOUT (dari sisi USER)
const completeBooking = async (req, res) => {
=======
// ❌ CANCEL BOOKING
const cancelBooking = async (req, res) => {
>>>>>>> 459e131ca4330585254e6f5e7ff5a98e3301e2a8
  try {
    const booking_id = req.params.id;
    const user_id = req.user.id;

    const [bookingRows] = await db.query(
      `SELECT * FROM bookings WHERE id = ? AND user_id = ?`,
<<<<<<< HEAD
=======
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
>>>>>>> 459e131ca4330585254e6f5e7ff5a98e3301e2a8
      [booking_id, user_id]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({ status: "error", message: "Booking tidak ditemukan" });
    }

    const booking = bookingRows[0];

    if (booking.status !== "confirmed") {
      return res.status(400).json({ status: "error", message: "Hanya booking berstatus confirmed yang dapat diselesaikan" });
    }

<<<<<<< HEAD
    await db.query(`UPDATE bookings SET status = 'completed' WHERE id = ?`, [booking_id]);
=======
    await db.query(
      `UPDATE bookings SET status = 'completed' WHERE id = ?`,
      [booking_id]
    );
>>>>>>> 459e131ca4330585254e6f5e7ff5a98e3301e2a8

    res.json({
      status: "success",
      message: "Booking berhasil diselesaikan",
      data: { booking_id, old_status: "confirmed", new_status: "completed" }
    });
  } catch (error) {
    console.error("COMPLETE BOOKING ERROR:", error);
<<<<<<< HEAD
    res.status(500).json({ status: "error", message: "Terjadi kesalahan server" });
  }
};

// ═══════════════════════════════════════════════════════════
// 📌 NEW: Fungsi untuk Super Admin Booking Panel
// ═══════════════════════════════════════════════════════════

// GET /api/bookings/admin — Super Admin melihat SEMUA booking dari SEMUA hotel
const getAdminBookings = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role === 'super_admin';
    const hotelId = req.user.hotel_id;

    // Jika bukan super admin dan tidak punya hotel_id, tolak
    if (!isSuperAdmin && !hotelId) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak: admin tidak terkait hotel manapun"
      });
    }

    const { status, search } = req.query;

    let sql = `
      SELECT 
        b.id,
        b.status,
        b.check_in,
        b.check_out,
        b.total_price,
        b.sla_deadline,
        b.special_request,
        b.guests,
        b.created_at,
        b.approved_at,
        b.rejected_at,
        b.check_in_at,
        b.check_out_at,
        b.expired_at,
        b.reject_reason,
        u.username AS guest_name,
        u.email AS guest_email,
        u.phone AS guest_phone,
        r.room_type,
        r.number AS room_number,
        h.name AS hotel_name,
        p.payment_method,
        p.payment_date AS paid_at,
        p.payment_reference
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN payments p ON p.booking_id = b.id
    `;

    const conditions = [];
    const params = [];

    // Jika BUKAN super admin, wajib filter berdasarkan hotel_id
    // Jika Super Admin, TIDAK ADA filter hotel_id (dia melihat semua)
    if (!isSuperAdmin) {
      conditions.push(`h.id = ?`);
      params.push(hotelId);
    }

    // Filter status
    if (status && status !== 'all') {
      conditions.push(`b.status = ?`);
      params.push(status);
    }

    // Filter search (nama tamu atau ID booking)
    if (search) {
      conditions.push(`(u.username LIKE ? OR b.id LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }

    // Gabungkan kondisi WHERE jika ada
    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY b.created_at DESC`;

    const [rows] = await db.query(sql, params);

    res.json({
      status: "success",
      message: "Data booking berhasil diambil",
      data: rows
    });
  } catch (error) {
    console.error("GET ADMIN BOOKINGS ERROR:", error);
=======
>>>>>>> 459e131ca4330585254e6f5e7ff5a98e3301e2a8
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server saat mengambil data booking"
    });
  }
};

<<<<<<< HEAD
// GET /api/bookings/admin/stats — Super Admin melihat statistik SEMUA hotel
const getBookingStats = async (req, res) => {
  try {
    const isSuperAdmin = req.user.role === 'super_admin';
    const hotelId = req.user.hotel_id;

    if (!isSuperAdmin && !hotelId) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak"
      });
    }

    let sql = `
      SELECT 
        COUNT(CASE WHEN b.status = 'pending' THEN 1 END) AS pending,
        COUNT(CASE WHEN b.status IN ('confirmed', 'checked_in') THEN 1 END) AS confirmed,
        COUNT(CASE WHEN b.status IN ('cancelled', 'expired') THEN 1 END) AS cancelled,
        COALESCE(SUM(CASE WHEN b.status IN ('confirmed','checked_in','completed') THEN b.total_price END), 0) AS revenue
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
    `;
    
    const params = [];

    // Jika BUKAN super admin, filter berdasarkan hotel_id
    if (!isSuperAdmin) {
      sql += ` WHERE r.hotel_id = ?`;
      params.push(hotelId);
    }

    const [rows] = await db.query(sql, params);

    res.json({
      status: "success",
      message: "Statistik berhasil diambil",
      data: rows[0]
    });
  } catch (error) {
    console.error("GET BOOKING STATS ERROR:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server saat mengambil statistik"
    });
  }
};

// PUT /api/bookings/:id/approve — Approve booking (pending → confirmed)
const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE bookings SET status = 'confirmed', approved_at = NOW() WHERE id = ? AND status = 'pending'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ status: "error", message: "Booking tidak ditemukan atau bukan status pending" });
    }

    res.json({
      status: "success",
      message: "Booking berhasil disetujui",
      data: { id, new_status: "confirmed" }
    });
  } catch (error) {
    console.error("APPROVE BOOKING ERROR:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan server saat menyetujui booking" });
  }
};

// PUT /api/bookings/:id/reject — Reject booking (pending → cancelled)
const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ status: "error", message: "Alasan penolakan wajib diisi" });
    }

    const [result] = await db.query(
      `UPDATE bookings SET status = 'cancelled', reject_reason = ?, rejected_at = NOW() WHERE id = ? AND status = 'pending'`,
      [reason.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ status: "error", message: "Booking tidak ditemukan atau bukan status pending" });
    }

    res.json({
      status: "success",
      message: "Booking ditolak",
      data: { id, new_status: "cancelled", reject_reason: reason.trim() }
    });
  } catch (error) {
    console.error("REJECT BOOKING ERROR:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan server saat menolak booking" });
  }
};

// PUT /api/bookings/:id/checkin — Check-in tamu (confirmed → checked_in)
const checkIn = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE bookings SET status = 'checked_in', check_in_at = NOW() WHERE id = ? AND status = 'confirmed'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ status: "error", message: "Booking tidak ditemukan atau bukan status confirmed" });
    }

    res.json({
      status: "success",
      message: "Tamu berhasil check-in",
      data: { id, new_status: "checked_in" }
    });
  } catch (error) {
    console.error("CHECK-IN ERROR:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan server saat check-in" });
  }
};

// PUT /api/bookings/:id/checkout — Check-out tamu (checked_in → completed)
const checkOut = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `UPDATE bookings SET status = 'completed', check_out_at = NOW() WHERE id = ? AND status = 'checked_in'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ status: "error", message: "Booking tidak ditemukan atau bukan status checked_in" });
    }

    res.json({
      status: "success",
      message: "Tamu berhasil check-out, kamar tersedia kembali",
      data: { id, new_status: "completed" }
    });
  } catch (error) {
    console.error("CHECK-OUT ERROR:", error);
    res.status(500).json({ status: "error", message: "Terjadi kesalahan server saat check-out" });
  }
};

module.exports = {
  // Fungsi User
  getBookings,
  addBooking,
  completeBooking,
  // Fungsi Super Admin
  getAdminBookings,
  getBookingStats,
  approveBooking,
  rejectBooking,
  checkIn,
  checkOut
=======
module.exports = {
  getBookings,
  addBooking,
  cancelBooking,
  completeBooking
>>>>>>> 459e131ca4330585254e6f5e7ff5a98e3301e2a8
};