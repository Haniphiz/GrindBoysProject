const express = require('express');
const { getBookings, addBooking } = require('../controllers/bookingController');
const router = express.Router();

router.get('/', getBookings);
router.post('/', addBooking);
console.log("getBookings:", getBookings);
console.log("addBooking:", addBooking);

module.exports = router;
