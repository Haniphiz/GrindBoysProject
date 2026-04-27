const Hotel = require("../models/hotelModel");
const { validateHotel, validateId } = require("../utils/validator");
const errorHandler = require("../utils/errorHandler");

class HotelController {
  index(req, res) {
    Hotel.getAll((err, results) => {
      if (err) return errorHandler(res, err, 500, "Gagal ambil data");
      res.json({ success: true, message: "Berhasil ambil semua hotel", data: results });
    });
  }

  store(req, res) {
    const data = req.body;
    const error = validateHotel(data);
    if (error) return errorHandler(res, error, 400, error);

    Hotel.create(data, err => {
      if (err) return errorHandler(res, err, 500, "Gagal tambah hotel");
      res.status(201).json({ success: true, message: "Hotel berhasil ditambahkan", data });
    });
  }

  update(req, res) {
    const { id } = req.params;
    const idError = validateId(id);
    if (idError) return errorHandler(res, idError, 400, idError);

    const data = req.body;
    const bodyError = validateHotel(data);
    if (bodyError) return errorHandler(res, bodyError, 400, bodyError);

    Hotel.update(id, data, err => {
      if (err) return errorHandler(res, err, 500, "Gagal update hotel");
      res.json({ success: true, message: "Hotel berhasil diupdate" });
    });
  }

  destroy(req, res) {
    const { id } = req.params;
    const error = validateId(id);
    if (error) return errorHandler(res, error, 400, error);

    Hotel.delete(id, err => {
      if (err) return errorHandler(res, err, 500, "Gagal hapus hotel");
      res.json({ success: true, message: "Hotel berhasil dihapus" });
    });
  }
}

module.exports = new HotelController();
