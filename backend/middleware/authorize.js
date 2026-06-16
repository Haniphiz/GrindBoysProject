const authorize = (role) => {

  return (
    req,
    res,
    next
  ) => {

    console.log(
      "REQ USER:"
    );

    console.log(
      req.user
    );

    if (!req.user) {

      return res.status(401).json({
        status: "error",
        message:
          "Unauthorized"
      });

    }

    if (
      req.user.role !== role
    ) {

      console.log(
        "ROLE TIDAK SESUAI"
      );

      console.log(
        "Role dari token:",
        req.user.role
      );

      console.log(
        "Role yang dibutuhkan:",
        role
      );

      return res.status(403).json({
        status: "error",
        message:
          `Akses ditolak (butuh role ${role})`
      });

    }

    next();
  };
};

module.exports = authorize;