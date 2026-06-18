const express = require('express');
const {
  getBookings,
  addBooking,
  cancelBooking,
  completeBooking
} = require('../controllers/bookingController');
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth, getBookings);
router.post("/", auth, addBooking);
router.put("/:id/cancel", auth, cancelBooking);
router.put("/:id/complete", auth, completeBooking);

module.exports = router;