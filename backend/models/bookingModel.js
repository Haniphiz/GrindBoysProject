const db = require("../config/db");

// 📌 NEW: Helper callback → Promise (fungsi lama tetap callback, fungsi baru pakai ini)
const queryAsync = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

const bookingModel = {

  // ============================================
  // FUNGSI LAMA — TIDAK DIUBAH
  // ============================================

  getAllBookings: (callback) => {
    const sql = `
      SELECT 
        bookings.id,
        users.username,
        hotels.name AS hotel,
        rooms.room_type,
        rooms.price
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN rooms ON bookings.room_id = rooms.id
      JOIN hotels ON rooms.hotel_id = hotels.id
    `;
    db.query(sql, callback);
  },

  getBookingsByUser: (user_id, callback) => {
    const sql = `
      SELECT 
        bookings.id,
        users.username,
        hotels.name AS hotel,
        rooms.room_type,
        rooms.price
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN rooms ON bookings.room_id = rooms.id
      JOIN hotels ON rooms.hotel_id = hotels.id
      WHERE bookings.user_id = ?
    `;
    db.query(sql, [user_id], callback);
  },

  addBooking: (data, callback) => {
    const sql = `
      INSERT INTO bookings (user_id, room_id)
      VALUES (?, ?)
    `;
    db.query(sql, [data.user_id, data.room_id], callback);
  },

  // ============================================
  // 📌 NEW: Fungsi untuk Admin Booking Panel
  // Kolom sudah disesuaikan dengan database asli
  // ============================================

  // Ambil semua booking untuk admin (dengan JOIN payments untuk info pembayaran)
  getAllForAdmin: async (hotelId, filters = {}) => {
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
      WHERE h.id = ?
    `;
    const params = [hotelId];

    // Filter status
    if (filters.status && filters.status !== 'all') {
      sql += ` AND b.status = ?`;
      params.push(filters.status);
    }

    // Filter search (nama tamu atau ID booking)
    if (filters.search) {
      sql += ` AND (u.username LIKE ? OR b.id LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    sql += ` ORDER BY b.created_at DESC`;

    const [rows] = await queryAsync(sql, params);
    return rows;
  },

  // Statistik untuk dashboard admin
  getStats: async (hotelId) => {
    const sql = `
      SELECT 
        COUNT(CASE WHEN b.status = 'pending' THEN 1 END) AS pending,
        COUNT(CASE WHEN b.status IN ('confirmed', 'checked_in') THEN 1 END) AS confirmed,
        COUNT(CASE WHEN b.status IN ('cancelled', 'expired') THEN 1 END) AS cancelled,
        COALESCE(SUM(CASE WHEN b.status IN ('confirmed','checked_in','completed') THEN b.total_price END), 0) AS revenue
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE r.hotel_id = ?
    `;

    const [rows] = await queryAsync(sql, [hotelId]);
    return rows[0];
  },

  // Approve: pending → confirmed
  approve: async (id) => {
    const sql = `
      UPDATE bookings 
      SET status = 'confirmed', approved_at = NOW() 
      WHERE id = ? AND status = 'pending'
    `;
    const [result] = await queryAsync(sql, [id]);
    return result.affectedRows > 0;
  },

  // Reject: pending → cancelled + simpan alasan
  reject: async (id, reason) => {
    const sql = `
      UPDATE bookings 
      SET status = 'cancelled', reject_reason = ?, rejected_at = NOW() 
      WHERE id = ? AND status = 'pending'
    `;
    const [result] = await queryAsync(sql, [reason, id]);
    return result.affectedRows > 0;
  },

  // Check-in: confirmed → checked_in
  checkIn: async (id) => {
    const sql = `
      UPDATE bookings 
      SET status = 'checked_in', check_in_at = NOW() 
      WHERE id = ? AND status = 'confirmed'
    `;
    const [result] = await queryAsync(sql, [id]);
    return result.affectedRows > 0;
  },

  // Check-out: checked_in → completed
  checkOut: async (id) => {
    const sql = `
      UPDATE bookings 
      SET status = 'completed', check_out_at = NOW() 
      WHERE id = ? AND status = 'checked_in'
    `;
    const [result] = await queryAsync(sql, [id]);
    return result.affectedRows > 0;
  },

  // Auto-expire booking yang melewati SLA
  expireOverdue: async () => {
    const sql = `
      UPDATE bookings 
      SET status = 'expired', expired_at = NOW() 
      WHERE status = 'pending' AND sla_deadline < NOW()
    `;
    const [result] = await queryAsync(sql, []);
    return result.affectedRows;
  }

};

module.exports = bookingModel;