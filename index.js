
require("dotenv").config();

const express = require("express");
const db = require("./src/config/db");

const app = express();
const port = 3000;

// 🔥 WAJIB DI ATAS
app.use(express.json());

const authRoutes = require("./src/routes/authRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");

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