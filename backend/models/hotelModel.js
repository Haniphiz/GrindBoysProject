const db = require("../config/db");

class Hotel {
  static getAll(callback) {
    db.query("SELECT * FROM hotels", callback);
  }

  static create(data, callback) {
    db.query("INSERT INTO hotels SET ?", data, callback);
  }

  static update(id, data, callback) {
    db.query("UPDATE hotels SET ? WHERE id = ?", [data, id], callback);
  }

  static delete(id, callback) {
    db.query("DELETE FROM hotels WHERE id = ?", [id], callback);
  }
}

module.exports = Hotel;
