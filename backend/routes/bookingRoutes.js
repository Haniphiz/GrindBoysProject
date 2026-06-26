const express = require('express');
const {
  getBookings,
  addBooking,
  cancelBooking,
  completeBooking,
  getAdminBookings,
  getBookingStats,
  approveBooking,
  rejectBooking,
  checkIn,
  checkOut
} = require('../controllers/bookingController');

const router = express.Router();
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// ===== ROUTE SUPER ADMIN =====
// Menggunakan array agar bisa diakses oleh "admin" maupun "super_admin"

// GET statistik booking
router.get("/admin/stats", auth, authorize(["admin", "super_admin"]), getBookingStats);

// GET semua booking untuk dashboard
router.get("/admin", auth, authorize(["admin", "super_admin"]), getAdminBookings);

// PUT approve booking
router.put("/:id/approve", auth, authorize(["admin", "super_admin"]), approveBooking);

// PUT reject booking
router.put("/:id/reject", auth, authorize(["admin", "super_admin"]), rejectBooking);

// PUT check-in
router.put("/:id/checkin", auth, authorize(["admin", "super_admin"]), checkIn);

// PUT check-out
router.put("/:id/checkout", auth, authorize(["admin", "super_admin"]), checkOut);


// ===== ROUTE UNTUK USER =====
router.get("/", auth, getBookings);
router.post("/", auth, addBooking);
router.put("/:id/cancel", auth, cancelBooking);
router.put("/:id/complete", auth, completeBooking);

module.exports = router;