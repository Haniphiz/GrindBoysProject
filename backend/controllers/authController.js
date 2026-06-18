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

    // 🔑 GENERATE JWT — 📌 TAMBAH hotel_id DI SINI
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        hotel_id: user.hotel_id        // 📌 BARU: null untuk user biasa, berisi ID hotel untuk admin hotel
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
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


// 🔥 UPDATE PROFILE (Username & Email)
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Diambil dari hasil decode token di middleware auth.js lu
    const userId = req.user?.id || req.user?.userId || req.userId;

    // ✅ VALIDASI INPUT
    if (!username || !email) {
      return res.status(400).json({
        status: "error",
        message: "Username dan email wajib diisi"
      });
    }

    // 🔍 CEK DUPLIKAT USERNAME / EMAIL (Kecuali akun milik user itu sendiri)
    const duplicate = await User.checkDuplicate(username, email, userId);
    if (duplicate.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Username atau email sudah digunakan akun lain"
      });
    }

    // ➕ UPDATE DATA KE DATABASE
    await User.updateInfo(userId, username, email);

    return res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui"
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server saat memperbarui profil"
    });
  }
};


// 🔥 CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id || req.user?.userId || req.userId;

    // ✅ VALIDASI INPUT
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password lama dan baru wajib diisi"
      });
    }

    // 🔍 CARI DATA USER BERDASARKAN ID
    const results = await User.findById(userId);
    if (results.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User tidak ditemukan"
      });
    }

    const user = results[0];

    // 🔐 CEK KECOCOKAN PASSWORD LAMA
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Password lama yang dimasukkan salah"
      });
    }

    // 🔐 HASH PASSWORD BARU
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // ➕ UPDATE PASSWORD DI DATABASE
    await User.updatePassword(userId, hashedNewPassword);

    return res.status(200).json({
      status: "success",
      message: "Kata sandi berhasil diperbarui"
    });

  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server saat memperbarui kata sandi"
    });
  }
};