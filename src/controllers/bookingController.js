const bookingModel = require('../models/bookingModel');

// 🔍 GET booking (sementara semua)
exports.getBookings = (req, res) => {
  bookingModel.getAllBookings((err, results) => {
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

// ➕ POST booking (AMAN)
exports.addBooking = (req, res) => {
  const user_id = req.user.id; // 🔥 dari token
  const { room_id } = req.body;

  // VALIDASI
  if (!room_id) {
    return res.status(400).json({
      status: "error",
      message: "room_id wajib diisi"
    });
  }

  bookingModel.addBooking({ user_id, room_id }, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    res.status(201).json({
      status: "success",
      message: "Booking berhasil ditambahkan",
      bookingId: result.insertId
    });
  });
};
exports.getBookings = (req, res) => {
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