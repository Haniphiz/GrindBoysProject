const Room = require("../models/roomModel");

// =========================
// GET ALL ROOMS
// =========================
exports.getRooms = async (req, res) => {
  try {
    const results = await Room.getAll();

    const updatedRooms = results.map(room => ({
      ...room,
      image_url: room.image_url
        ? `${req.protocol}://${req.get("host")}/uploads/${room.image_url}`
        : null
    }));

    res.json({
      status: "success",
      data: updatedRooms
    });

  } catch (error) {
    console.error("GET ROOMS ERROR:", error);

    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// =========================
// GET ROOM BY ID
// =========================
exports.getRoomById = async (req, res) => {
  try {

    const room = await Room.getById(
      req.params.id
    );

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Room tidak ditemukan"
      });
    }

    if (room.image_url) {
      room.image_url =
        `${req.protocol}://${req.get("host")}/uploads/${room.image_url}`;
    }

    res.json({
      status: "success",
      data: room
    });

  } catch (error) {
    console.error("GET ROOM ERROR:", error);

    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// =========================
// CREATE ROOM
// =========================
exports.createRoom = async (req, res) => {
  try {

    const {
      hotel_id,
      room_type,
      price,
      capacity,
      description
    } = req.body;

    const image_url = req.file
      ? req.file.filename
      : null;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (
      !hotel_id ||
      !room_type ||
      !price ||
      !capacity
    ) {
      return res.status(400).json({
        status: "error",
        message: "Semua field wajib diisi"
      });
    }

    const result = await Room.create({
      hotel_id,
      room_type,
      price,
      capacity,
      description,
      image_url
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

// =========================
// UPDATE ROOM
// =========================
exports.updateRoom = async (req, res) => {

  try {

    let image_url;

    if (req.file) {

      image_url =
        req.file.filename;

    } else {

      const currentRoom =
        await Room.getById(
          req.params.id
        );

      image_url =
        currentRoom.image_url;
    }

    await Room.update(
      req.params.id,
      {
        ...req.body,
        image_url
      }
    );

    res.json({
      status: "success",
      message: "Kamar berhasil diupdate"
    });

  } catch (error) {

    console.error(
      "UPDATE ROOM ERROR:",
      error
    );

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }
};

// =========================
// DELETE ROOM
// =========================
exports.deleteRoom = async (req, res) => {
  try {

    await Room.delete(req.params.id);

    res.json({
      status: "success",
      message: "Kamar berhasil dihapus"
    });

  } catch (error) {

    if (
      error.code ===
      "ER_ROW_IS_REFERENCED_2"
    ) {

      return res.status(400).json({
        status: "error",
        message:
          "Kamar tidak bisa dihapus karena masih memiliki booking."
      });

    }

    console.error(error);

    res.status(500).json({
      status: "error",
      message: error.message
    });

  }
};