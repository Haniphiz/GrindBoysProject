const db = require("../config/db");

const Room = {
  getAll: (callback) => {
    db.query("SELECT * FROM rooms", callback);
  },

 create: (data, callback) => {
  const sql = `
    INSERT INTO rooms (hotel_id, room_type, price, capacity)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [
    data.hotel_id,
    data.room_type,
    data.price,
    data.capacity
  ], callback);
}
};

module.exports = Room;