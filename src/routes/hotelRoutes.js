const express = require("express");
const router = express.Router();

const { getHotels, createHotel } = require("../controllers/hotelController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// semua user bisa lihat hotel
router.get("/", getHotels);

// hanya admin yang bisa tambah hotel
router.post("/", auth, authorize("admin"), createHotel);

module.exports = router;