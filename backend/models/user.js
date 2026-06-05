const db = require("../config/db");

class User {
  // 🔍 cari user berdasarkan email
  static async findByEmail(email) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows;
  }

  // ➕ tambah user
  static async create(data) {
    const [result] = await db.query(
      `INSERT INTO users (username, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [
        data.username,
        data.email,
        data.password,
        data.role || "user"
      ]
    );
    return result;
  }

  // 🔍 ambil semua user
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  }

  // 🔍 ambil user by id
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }
}

module.exports = User;