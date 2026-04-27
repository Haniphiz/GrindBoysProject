const Room = require("../models/roomModel");

// GET rooms
exports.getRooms = (req, res) => {
  Room.getAll((err, results) => {
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

// POST room (admin only)
exports.createRoom = (req, res) => {
  const { hotel_id, room_type, price, capacity } = req.body;

  if (!hotel_id || !room_type || !price || !capacity) {
    return res.status(400).json({
      status: "error",
      message: "Semua field wajib diisi"
    });
  }

  Room.create({ hotel_id, room_type, price, capacity }, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    res.status(201).json({
      status: "success",
      message: "Kamar berhasil ditambahkan",
      roomId: result.insertId
    });
  });
};