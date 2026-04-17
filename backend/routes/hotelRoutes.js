const express = require("express");
const HotelController = require("../controllers/hotelController");
const router = express.Router();

router.get("/", HotelController.index);
router.post("/", HotelController.store);
router.put("/:id", HotelController.update);
router.delete("/:id", HotelController.destroy);

module.exports = router;
