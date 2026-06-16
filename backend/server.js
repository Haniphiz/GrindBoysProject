const express = require("express");
const cors = require("cors");
const path = require("path");

// IMPORT SEMUA ROUTES
const authRoutes = require("./routes/authRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const roomRoutes = require("./routes/roomRoutes");

// LOAD ENV
require("dotenv").config({
  path: require("path").join(__dirname, "..", ".env")
});

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// SERVE UPLOADS
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/rooms", roomRoutes);

// START SERVER
app.listen(3000, () => {
  console.log("Server running on port 3000");
});