const express = require("express");
const db = require("./backend/config/db");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const port = 3000;

app.use(express.json());

// test endpoint
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
      result,
    });
  });
});

// 🔥 ini yang menghubungkan API booking
app.use("/booking", bookingRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
