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

    // tambahkan full URL untuk image
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
  });
};


// ➕ CREATE hotel (admin only + upload gambar)
exports.createHotel = (req, res) => {
  const name = req.body?.name;
  const address = req.body?.address;
  const city = req.body?.city;
  const description = req.body?.description;
  // ambil file dari multer
  const image_url = req.file ? req.file.filename : null;

  // validasi
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
    }
  );

  
};

// UPDATE HOTEL
exports.updateHotel = (req, res) => {
  const id = req.params.id;

  const name = req.body?.name;
  const address = req.body?.address;
  const city = req.body?.city;
  const description = req.body?.description;

  // ambil file baru (jika upload ulang)
  const image_url = req.file ? req.file.filename : null;

  if (!name || !address || !city) {
    return res.status(400).json({
      status: "error",
      message: "Nama, alamat, dan kota wajib diisi"
    });
  }

  Hotel.update(
    id,
    { name, address, city, description, image_url },
    (err, result) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err.message
        });
      }

      res.json({
        status: "success",
        message: "Hotel berhasil diperbarui"
      });
    }
  );
};


// DELETE HOTEL
exports.deleteHotel = (req, res) => {
  const id = req.params.id;

  Hotel.delete(id, (err, result) => {
    if (err) {
      // cek error foreign key
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          status: "error",
          message: "Hotel tidak bisa dihapus karena masih memiliki relasi (room/booking)"
        });
      }

      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    res.json({
      status: "success",
      message: "Hotel berhasil dihapus"
    });
  });
};