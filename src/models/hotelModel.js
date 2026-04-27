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
  }
};

module.exports = Hotel;