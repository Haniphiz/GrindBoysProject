const db = require("../config/db");

class User {
  // 🔍 Cari user berdasarkan email
  static async findByEmail(email) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows;
  }

  // ➕ Tambah user baru (Register)
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

  // 🔍 Ambil semua user
  static async getAll() {
    const [rows] = await db.query("SELECT * FROM users");
    return rows;
  }

  // 🔍 Ambil user berdasarkan ID
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?", 
      [id]
    );
    return rows;
  }

  // 🔍 Cek apakah username atau email sudah dipakai orang lain
  static async checkDuplicate(username, email, excludeId) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?",
      [username, email, excludeId]
    );
    return rows;
  }

  // ✏️ Mengupdate username dan email (Profile Info)
  static async updateInfo(id, username, email) {
    const [result] = await db.query(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, id]
    );
    return result;
  }

  // 🔐 Mengupdate password saja
  static async updatePassword(id, hashedPassword) {
    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id]
    );
    return result;
  }
}

module.exports = User;