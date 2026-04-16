const conn = require('../config/db');

exports.getAllHotels = (callback) => {
  conn.query("SELECT * FROM hotels", callback);
};

exports.addHotel = (data, callback) => {
  conn.query("INSERT INTO hotels SET ?", data, callback);
};
