const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  getDashboardStats
} = require("../controllers/adminController");

router.get(
  "/dashboard",
  auth,
  authorize("admin"),
  getDashboardStats
);

module.exports = router;