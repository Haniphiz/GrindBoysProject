const express = require("express");
const router = express.Router();
const db = require("../config/db");

// REGISTER
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Register gagal" });
      }
      res.json({ message: "Register berhasil" });
    }
  );
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