const User = require("../models/user");
const bcrypt = require("bcrypt");

// 🔥 REGISTER
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // VALIDASI INPUT
  if (!username || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Semua field wajib diisi"
    });
  }

  try {
    // CEK EMAIL SUDAH ADA ATAU BELUM
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

      // 🔥 HASH PASSWORD
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username,
        email,
        password: hashedPassword,
        role: "user"
      };

      // SIMPAN KE DATABASE
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
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// 🔥 LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  // VALIDASI INPUT
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email dan password wajib diisi"
    });
  }

  // CEK USER BERDASARKAN EMAIL
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
      // 🔥 BANDINKAN PASSWORD
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          status: "error",
          message: "Password salah"
        });
      }

      // LOGIN BERHASIL
      res.json({
        status: "success",
        message: "Login berhasil",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  });
};
