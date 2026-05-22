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

// 🔍 CEK APAKAH ROOM SUDAH DIBOOKING
const [existingBooking] = await db.query(
  `
  SELECT * FROM bookings
  WHERE room_id = ?
  AND status != 'cancelled'
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

    const status = "pending";

    // ➕ Insert booking
  const [result] = await db.query(
  `INSERT INTO bookings 
   (user_id, room_id, check_in, check_out, total_price, status)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    user_id,
    room_id,
    check_in,
    check_out,
    total_price,
    status
  ]
);
res.status(201).json({
  status: "success",
  message: "Booking berhasil ditambahkan",
  data: {
    booking_id: result.insertId,
    room_id,
    check_in,
    check_out,
    total_price,
    booking_status: status
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

// ✅ EXPORT WAJIB
module.exports = {
  getBookings,
  addBooking
};