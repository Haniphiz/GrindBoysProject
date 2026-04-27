const db = require("../config/db");

const bookingModel = {

  // 🔹 ambil semua booking (JOIN)
  getAllBookings: (callback) => {
    const sql = `
      SELECT 
        bookings.id,
        users.username,
        hotels.name AS hotel,
        rooms.room_type,
        rooms.price
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN rooms ON bookings.room_id = rooms.id
      JOIN hotels ON rooms.hotel_id = hotels.id
    `;

    db.query(sql, callback);
  },

  // 🔥 INI YANG KAMU TANYAKAN
  getBookingsByUser: (user_id, callback) => {
    const sql = `
      SELECT 
        bookings.id,
        users.username,
        hotels.name AS hotel,
        rooms.room_type,
        rooms.price
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN rooms ON bookings.room_id = rooms.id
      JOIN hotels ON rooms.hotel_id = hotels.id
      WHERE bookings.user_id = ?
    `;

    db.query(sql, [user_id], callback);
  },

  // tambah booking
  addBooking: (data, callback) => {
    const sql = `
      INSERT INTO bookings (user_id, room_id)
      VALUES (?, ?)
    `;

    db.query(sql, [data.user_id, data.room_id], callback);
  }

};

module.exports = bookingModel;