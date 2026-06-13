const express = require("express");
const cors = require("cors");

// IMPORT SEMUA ROUTES
const authRoutes = require("./routes/authRoutes");       // ← UNTUK LOGIN & REGISTER
const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // ← UNTUK PAYMENT

// LOAD ENV DARI ROOT FOLDER
require("dotenv").config({ path: require("path").join(__dirname, '..', '.env') });

const app = express();

// MIDDLEWARE WAJIB PALING ATAS
app.use(cors());
app.use(express.json());

// DAFTARKAN SEMUA ROUTE
app.use("/api/auth", authRoutes);         // ← TAMBAHKAN INI
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);  // ← TAMBAHKAN INI

app.listen(3000, () => {
  console.log("Server running on port 3000");
});