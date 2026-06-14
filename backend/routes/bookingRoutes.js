const express = require('express');
const {
  getBookings,
  addBooking,
  completeBooking
} = require('../controllers/bookingController');
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth, getBookings);
router.post("/", auth, addBooking);

router.put(
  "/:id/complete",
  auth,
  completeBooking
);
console.log("getBookings:", getBookings);
console.log("addBooking:", addBooking);

module.exports = router;