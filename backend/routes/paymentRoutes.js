const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  createPayment,
  verifyPayment
} = require("../controllers/paymentController");

// =========================
// USER CREATE PAYMENT
// =========================
router.post(
  "/",
  auth,
  createPayment
);

// =========================
// ADMIN VERIFY PAYMENT
// =========================
router.put(
  "/:id/verify",
  auth,
  authorize("admin"),
  verifyPayment
);

module.exports = router;