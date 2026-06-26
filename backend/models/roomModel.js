const db = require("../config/db");

const Room = {

  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT * FROM rooms WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  getAll: async (hotelId) => {
    let sql = `
      SELECT r.*, h.name AS hotel_name
      FROM rooms r
      JOIN hotels h ON r.hotel_id = h.id
    `;

    // Jika ada parameter hotelId, tambahkan WHERE clause
    if (hotelId) {
      sql += ` WHERE r.hotel_id = ?`;
      const [rows] = await db.query(sql, [hotelId]);
      return rows;
    }

    const [rows] = await db.query(sql);
    return rows;
  },

  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO rooms (hotel_id, room_type, price, capacity, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.hotel_id,
        data.room_type,
        data.price,
        data.capacity,
        data.description,
        data.image_url
      ]
    );
    return result;
  },

  update: async (id, data) => {
    const [result] = await db.query(
      `UPDATE rooms
       SET hotel_id = ?, room_type = ?, price = ?, capacity = ?, description = ?, image_url = ?
       WHERE id = ?`,
      [
        data.hotel_id,
        data.room_type,
        data.price,
        data.capacity,
        data.description,
        data.image_url,
        id
      ]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM rooms WHERE id = ?",
      [id]
    );
    return result;
  }
};

module.exports = Room;