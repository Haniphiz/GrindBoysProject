const express = require("express");
const router = express.Router();

// 1. Import semua fungsi controller yang kita butuhkan
const { register, login, updateProfile, changePassword } = require("../controllers/authController");

// 2. Import middleware verifikasi token JWT
const verifyToken = require("../middleware/auth");

// 🔓 ROUTE UMUM (Gak perlu login)
router.post("/register", register);
router.post("/login", login);

// 🔐 ROUTE PROTECTED (Wajib login / bawa token)
router.put("/profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;