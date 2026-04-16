const hotelModel = require('../models/hotelModel');

exports.getHotels = (req, res) => {
  hotelModel.getAllHotels((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.addHotel = (req, res) => {
  const data = req.body;
  hotelModel.addHotel(data, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Hotel berhasil ditambahkan", id: result.insertId });
  });
};
