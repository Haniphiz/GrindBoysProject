const express = require("express");
const router = express.Router();
const { 
  getHotels, 
  getHotelDetail,
  getFeaturedHotels,
  createHotel, 
  updateHotel, 
  deleteHotel 
} = require("../controllers/hotelController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const upload = require("../middleware/upload");

// 🌟 Hotel unggulan untuk halaman utama (HARUS sebelum /:id)
router.get("/featured", getFeaturedHotels);

// Semua user bisa lihat hotel
router.get("/", getHotels);
router.get("/:id", getHotelDetail);

// Admin only
router.post("/", auth, authorize("admin"), upload.single("image"), createHotel);
router.put("/:id", auth, authorize("admin"), upload.single("image"), updateHotel);
router.delete("/:id", auth, authorize("admin"), deleteHotel);

module.exports = router;