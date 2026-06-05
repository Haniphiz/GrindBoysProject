
require("dotenv").config();

const express = require("express");
const cors = require("cors"); 
const db = require("./backend/config/db");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// 🔥 WAJIB DI ATAS
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const reviewRoutes = require("./backend/routes/reviewRoutes");
const authRoutes = require("./backend/routes/authRoutes");
const bookingRoutes = require("./backend/routes/bookingRoutes");
const roomRoutes = require("./backend/routes/roomRoutes");
const hotelRoutes = require("./backend/routes/hotelRoutes");
const paymentRoutes = require("./backend/routes/paymentRoutes");

app.use("/payments", paymentRoutes);

app.use("/hotels", hotelRoutes);

app.use("/rooms", roomRoutes);

app.use("/reviews", reviewRoutes);
// ROUTES
app.use("/auth", authRoutes);
app.use("/booking", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// test database
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json({
      message: "Database connected",
      result
    });
  });
});

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});