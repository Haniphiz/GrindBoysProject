const express = require('express');
const {
  getBookings,
  addBooking,
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
// Super Admin bisa mengakses semua hotel

// GET statistik booking
router.get("/admin/stats", auth, authorize("super_admin"), getBookingStats);

// GET semua booking untuk dashboard
router.get("/admin", auth, authorize("super_admin"), getAdminBookings);

// PUT approve booking
router.put("/:id/approve", auth, authorize("super_admin"), approveBooking);

// PUT reject booking
router.put("/:id/reject", auth, authorize("super_admin"), rejectBooking);

// PUT check-in
router.put("/:id/checkin", auth, authorize("super_admin"), checkIn);

// PUT check-out
router.put("/:id/checkout", auth, authorize("super_admin"), checkOut);


// ===== ROUTE UNTUK USER =====
router.get("/", auth, getBookings);
router.post("/", auth, addBooking);
router.put("/:id/complete", auth, completeBooking);

module.exports = router;