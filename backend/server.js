const express = require("express");
const cors = require("cors");

const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(cors());          // <--- ini penting
app.use(express.json());

app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
