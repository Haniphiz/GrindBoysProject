const db = require("../config/db");

const Room = {

  // 🔍 Ambil semua room
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM rooms");
    return rows;
  },

  // ➕ Tambah room
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO rooms (hotel_id, room_type, price, capacity)
       VALUES (?, ?, ?, ?)`,
      [
        data.hotel_id,
        data.room_type,
        data.price,
        data.capacity
      ]
    );
    return result;
  }

};

module.exports = Room;