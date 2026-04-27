const db = require("../config/db"); // pastikan path ini benar

class User {
  // 🔍 cari user berdasarkan email
  static findByEmail(email, callback) {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  }

  // ➕ tambah user
  static create(data, callback) {
    const sql = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        data.username,
        data.email,
        data.password,
        data.role || "user"
      ],
      callback
    );
  }

  // 🔍 ambil semua user
  static getAll(callback) {
    const sql = "SELECT * FROM users";
    db.query(sql, callback);
  }

  // 🔍 ambil user by id
  static findById(id, callback) {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  }
}

module.exports = User;