const express = require("express");
const router = express.Router();

const { getHotels, createHotel } = require("../controllers/hotelController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// 👉 tambahkan ini
const upload = require("../middleware/upload");

router.post(
  "/",
  auth,
  authorize("admin"),
  upload.single("image"), // 🔥 WAJIB sebelum controller
  createHotel
);

// semua user bisa lihat hotel
router.get("/", getHotels);

// hanya admin yang bisa tambah hotel
router.post("/", auth, authorize("admin"), createHotel);

module.exports = router;