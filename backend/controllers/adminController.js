const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {

    const [hotel] =
      await db.query(
        "SELECT COUNT(*) total FROM hotels"
      );

    const [room] =
      await db.query(
        "SELECT COUNT(*) total FROM rooms"
      );

    const [booking] =
      await db.query(
        "SELECT COUNT(*) total FROM bookings"
      );

    const [user] =
      await db.query(
        "SELECT COUNT(*) total FROM users"
      );

    res.json({
      status: "success",
      data: {
        totalHotels:
          hotel[0].total,

        totalRooms:
          room[0].total,

        totalBookings:
          booking[0].total,

        totalUsers:
          user[0].total
      }
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};