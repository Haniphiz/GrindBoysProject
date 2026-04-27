const express = require("express");
const router = express.Router();
const db = require("../config/db");

// REGISTER
router.post("/register", (req, res) => {
  console.log("BODY MASUK:", req.body);
  const { email, username, password } = req.body;

  const sql = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
  db.query(sql, [email, username, password], (err, result) => {
    if (err) {
      console.log(err);
      // Kirim dalam bentuk JSON agar dibaca benar oleh frontend
      return res.status(500).json({ message: "Register gagal: " + err.sqlMessage });
    }
    // Kirim dalam bentuk JSON agar alert(data.message) muncul tulisan "Berhasil!"
    res.json({ message: "Berhasil!" });
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.json({ message: "Error server" });

      if (result.length > 0) {
        res.json({ message: "Login berhasil" });
      } else {
        res.json({ message: "Username/password salah" });
      }
    }
  );
});

module.exports = router;