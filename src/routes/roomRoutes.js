const express = require("express");
const router = express.Router();

const { getRooms, createRoom } = require("../controllers/roomController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// semua user bisa lihat kamar
router.get("/", getRooms);

// 🔥 hanya admin
router.post("/", auth, authorize("admin"), createRoom);

module.exports = router;