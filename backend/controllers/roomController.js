const Room = require("../models/roomModel");

// GET rooms
exports.getRooms = async (req, res) => {
  try {
    const results = await Room.getAll();

    res.json({
      status: "success",
      data: results
    });

  } catch (error) {
    console.error("GET ROOMS ERROR:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

// POST room
exports.createRoom = async (req, res) => {
  try {
    const { hotel_id, room_type, price, capacity } = req.body;

    if (!hotel_id || !room_type || !price || !capacity) {
      return res.status(400).json({
        status: "error",
        message: "Semua field wajib diisi"
      });
    }

    const result = await Room.create({
      hotel_id,
      room_type,
      price,
      capacity
    });

    res.status(201).json({
      status: "success",
      message: "Kamar berhasil ditambahkan",
      roomId: result.insertId
    });

  } catch (error) {
    console.error("CREATE ROOM ERROR:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};