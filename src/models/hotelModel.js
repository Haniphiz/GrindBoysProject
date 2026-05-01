const db = require("../config/db");

const Hotel = {

  // 🔍 Ambil semua hotel
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM hotels");
    return rows;
  },

  // 🔍 Ambil hotel by ID
  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM hotels WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // ➕ Tambah hotel
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO hotels (name, address, city, description, image_url)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.name,
        data.address,
        data.city,
        data.description,
        data.image_url
      ]
    );
    return result;
  },

  // ✏️ Update hotel
  update: async (id, data) => {
    const [result] = await db.query(
      `UPDATE hotels 
       SET name=?, address=?, city=?, description=?, image_url=?
       WHERE id=?`,
      [
        data.name,
        data.address,
        data.city,
        data.description,
        data.image_url,
        id
      ]
    );
    return result;
  },

  // ❌ Delete hotel
  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM hotels WHERE id=?",
      [id]
    );
    return result;
  }
};

module.exports = Hotel;