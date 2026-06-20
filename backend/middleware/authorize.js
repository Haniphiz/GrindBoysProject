const authorize = (role) => {
  return (req, res, next) => {
    
    // 1. Ubah 'role' menjadi array jika dia masih berupa string
    const allowedRoles = Array.isArray(role) ? role : [role];

    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      });
    }

    // 2. Gunakan .includes() untuk mengecek apakah role user ada di dalam daftar
    if (!allowedRoles.includes(req.user.role)) {
      console.log("ROLE TIDAK SESUAI");
      console.log("Role dari token:", req.user.role);
      console.log("Role yang dibutuhkan:", allowedRoles);

      return res.status(403).json({
        status: "error",
        message: `Akses ditolak (butuh role ${allowedRoles.join(' atau ')})`
      });
    }

    next();
  };
};

module.exports = authorize;