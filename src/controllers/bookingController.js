const bookingModel = require('../models/bookingModel');

// GET all booking
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

// POST booking
exports.addBooking = (req, res) => {
  const { user_id, room_id } = req.body;

  // 🔥 VALIDASI
  if (!user_id || !room_id) {
    return res.status(400).json({
      status: "error",
      message: "Nama dan kamar wajib diisi"
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