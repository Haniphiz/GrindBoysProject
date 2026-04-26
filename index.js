const express = require("express");
const path = require("path");
const authRoutes = require("./backend/routes/auth");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⬇️ biar HTML bisa diakses dari localhost
app.use(express.static(path.join(__dirname, "frontend/public")));

// ⬇️ route login & register
app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});