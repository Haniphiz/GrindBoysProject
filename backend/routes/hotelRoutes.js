const express = require('express');
const { getHotels, addHotel } = require('../controllers/hotelController');
const router = express.Router();

router.get('/', getHotels);
router.post('/', addHotel);

module.exports = router;
