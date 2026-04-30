const db = require("../config/db");

const Hotel = {
  getAll: (callback) => {
    db.query("SELECT * FROM hotels", callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO hotels (name, address, city, description, image_url)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      data.name,
      data.address,
      data.city,
      data.description,
      data.image_url
    ], callback);
  },

  
  update: (id, data, callback) => {
    const sql = `
      UPDATE hotels 
      SET name=?, address=?, city=?, description=?, image_url=?
      WHERE id=?
    `;

    db.query(sql, [
      data.name,
      data.address,
      data.city,
      data.description,
      data.image_url,
      id
    ], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM hotels WHERE id=?", [id], callback);
  }
};

module.exports = Hotel;