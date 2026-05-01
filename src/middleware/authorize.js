const authorize = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        status: "error",
        message: "Akses ditolak (bukan admin)"
      });
    }const authorize = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized"
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        status: "error",
        message: `Akses ditolak (butuh role ${role})`
      });
    }

    next();
  };
};

module.exports = authorize;

    next();
  };
};

module.exports = authorize;