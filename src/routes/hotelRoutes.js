const express = require("express");
const router = express.Router();
const { 
  getHotels, 
  getHotelDetail,
  createHotel, 
  updateHotel, 
  deleteHotel 
} = require("../controllers/hotelController");

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
router.get("/:id", getHotelDetail);
// hanya admin yang bisa tambah hotel
// UPDATE hotel (admin only + optional upload)
router.put(
  "/:id",
  auth,
  authorize("admin"),
  upload.single("image"),
  updateHotel
);

// DELETE hotel (admin only)
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteHotel
);

module.exports = router;