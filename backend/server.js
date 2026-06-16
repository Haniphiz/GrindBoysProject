// ⚠️ BARIS INI HARUS PALING ATAS, SEBELUM REQUIRE LAINNYA
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// ... require lainnya

const app = express();

// ── MIDDLEWARE ──
app.use(cors({
  origin: "http://localhost:5173", // URL Vite frontend kamu
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"] // ← PENTING: Authorization harus diizinkan
}));
app.use(express.json());

// ── ROUTES ──
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// ── START SERVER ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`🔑 JWT_SECRET terload: ${process.env.JWT_SECRET ? "YA" : "TIDAK - PERINGATAN!"}`);
});