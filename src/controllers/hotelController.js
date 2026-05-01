const Hotel = require("../models/hotelModel");

// 🔍 GET semua hotel
exports.getHotels = async (req, res) => {
  try {
    const results = await Hotel.getAll();

    const updatedResults = results.map(hotel => ({
      ...hotel,
      image_url: hotel.image_url
        ? `${req.protocol}://${req.get("host")}/uploads/${hotel.image_url}`
        : null
    }));

    res.json({
      status: "success",
      data: updatedResults
    });

  } catch (error) {
    console.error("GET HOTELS ERROR:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

// ➕ CREATE hotel (admin only + upload gambar)
exports.createHotel = async (req, res) => {
  try {
    const { name, address, city, description } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!name || !address || !city) {
      return res.status(400).json({
        status: "error",
        message: "Nama, alamat, dan kota wajib diisi"
      });
    }

    const result = await Hotel.create({
      name,
      address,
      city,
      description,
      image_url
    });

    res.status(201).json({
      status: "success",
      message: "Hotel berhasil ditambahkan",
      data: {
        id: result.insertId,
        name,
        address,
        city,
        description,
        image_url: image_url
          ? `${req.protocol}://${req.get("host")}/uploads/${image_url}`
          : null
      }
    });

  } catch (error) {
    console.error("CREATE HOTEL ERROR:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// UPDATE HOTEL
exports.updateHotel = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, address, city, description } = req.body;
    const image_url = req.file ? req.file.filename : null;

    if (!name || !address || !city) {
      return res.status(400).json({
        status: "error",
        message: "Nama, alamat, dan kota wajib diisi"
      });
    }

    await Hotel.update(id, {
      name,
      address,
      city,
      description,
      image_url
    });

    res.json({
      status: "success",
      message: "Hotel berhasil diperbarui"
    });

  } catch (error) {
    console.error("UPDATE HOTEL ERROR:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// DELETE HOTEL
exports.deleteHotel = async (req, res) => {
  try {
    const id = req.params.id;

    await Hotel.delete(id);

    res.json({
      status: "success",
      message: "Hotel berhasil dihapus"
    });

  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        status: "error",
        message: "Hotel tidak bisa dihapus karena masih memiliki relasi (room/booking)"
      });
    }

    console.error("DELETE HOTEL ERROR:", error);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};