const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

router.post("/", auth, reviewController.addReview);

router.get(
  "/hotel/:hotelId",
  reviewController.getReviewsByHotel
);

module.exports = router;