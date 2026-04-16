const bookingModel = require('../models/bookingModel');

exports.getBookings = (req, res) => {
  bookingModel.getAllBookings((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.addBooking = (req, res) => {
  const data = req.body;
  bookingModel.addBooking(data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Booking berhasil ditambahkan", id: result.insertId });
  });
};
