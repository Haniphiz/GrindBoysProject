const express = require('express');
const { getBookings, addBooking } = require('../controllers/bookingController');
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth, getBookings);
router.post("/", auth, addBooking);
console.log("getBookings:", getBookings);
console.log("addBooking:", addBooking);

module.exports = router;
