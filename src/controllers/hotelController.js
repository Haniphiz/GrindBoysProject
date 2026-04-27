const Hotel = require("../models/hotelModel");

// 🔍 GET semua hotel
exports.getHotels = (req, res) => {
  Hotel.getAll((err, results) => {
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

// ➕ CREATE hotel (admin only)
exports.createHotel = (req, res) => {
  const { name, address, city, description, image_url } = req.body;

  if (!name || !address || !city) {
    return res.status(400).json({
      status: "error",
      message: "Nama, alamat, dan kota wajib diisi"
    });
  }

  Hotel.create(
    { name, address, city, description, image_url },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err.message
        });
      }

      res.status(201).json({
        status: "success",
        message: "Hotel berhasil ditambahkan",
        hotelId: result.insertId
      });
    }
  );
};