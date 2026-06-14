const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Akses ditolak, token tidak ditemukan"
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Menyisipkan data token (id, email, role) ke req.user
    next();
  } catch (error) {
    console.error("JWT VERIFICATION ERROR:", error);
    return res.status(403).json({
      status: "error",
      message: "Token tidak valid atau sudah kedaluwarsa"
    });
  }
};

module.exports = verifyToken;