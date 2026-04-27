const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔥 REGISTER
exports.register = (req, res) => {
  const { username, email, password } = req.body;

  // VALIDASI INPUT
  if (!username || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Semua field wajib diisi"
    });
  }

  // CEK EMAIL
  User.findByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Email sudah digunakan"
      });
    }

    try {
      // 🔥 HASH PASSWORD
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username,
        email,
        password: hashedPassword,
        role: "user"
      };

      // SIMPAN KE DB
      User.create(newUser, (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: err.message
          });
        }

        res.status(201).json({
          status: "success",
          message: "Register berhasil",
          userId: result.insertId
        });
      });

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  });
};

// 🔥 LOGIN (FINAL + JWT)
exports.login = (req, res) => {
  const { email, password } = req.body;

  // VALIDASI
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email dan password wajib diisi"
    });
  }

  // CARI USER
  User.findByEmail(email, async (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: err.message
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User tidak ditemukan"
      });
    }

    const user = results[0];

    try {
      // 🔥 CEK PASSWORD
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          status: "error",
          message: "Password salah"
        });
      }

      // 🔥 GENERATE JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // RESPONSE
      res.json({
        status: "success",
        message: "Login berhasil",
        token: token
      });

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  });
};