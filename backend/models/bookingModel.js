const conn = require('../config/db');

exports.getAllBookings = (callback) => {
  conn.query("SELECT * FROM bookings", callback);
};

exports.addBooking = (data, callback) => {
  conn.query("INSERT INTO bookings SET ?", data, callback);
};
