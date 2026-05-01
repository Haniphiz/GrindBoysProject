const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔥 REGISTER (ASYNC VERSION)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ VALIDASI INPUT
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Semua field wajib diisi"
      });
    }

    // 🔍 CEK EMAIL
    const existingUser = await User.findByEmail(email);

    if (existingUser.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Email sudah digunakan"
      });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ➕ SIMPAN USER
    const result = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user"
    });

    return res.status(201).json({
      status: "success",
      message: "Register berhasil",
      userId: result.insertId
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};


// 🔥 LOGIN (ASYNC + JWT)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ VALIDASI
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email dan password wajib diisi"
      });
    }

    // 🔍 CARI USER
    const results = await User.findByEmail(email);

    if (results.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User tidak ditemukan"
      });
    }

    const user = results[0];

    // 🔐 CEK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Password salah"
      });
    }

    // 🔑 GENERATE JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      status: "success",
      message: "Login berhasil",
      token
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};