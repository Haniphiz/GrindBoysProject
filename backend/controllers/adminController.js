const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ totalHotels }]] = await db.query("SELECT COUNT(*) totalHotels FROM hotels");
    const [[{ totalRooms }]] = await db.query("SELECT COUNT(*) totalRooms FROM rooms");
    const [[{ totalBookings }]] = await db.query("SELECT COUNT(*) totalBookings FROM bookings");
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) totalUsers FROM users");

    const [[{ totalRevenue }]] = await db.query(
      "SELECT COALESCE(SUM(total_price), 0) totalRevenue FROM bookings WHERE status IN ('confirmed','completed','checked_in')"
    );

    const [statusCounts] = await db.query(
      "SELECT status, COUNT(*) count FROM bookings GROUP BY status"
    );
    const counts = { pending: 0, confirmed: 0, cancelled: 0, completed: 0, checked_in: 0, expired: 0 };
    statusCounts.forEach((r) => { counts[r.status] = r.count; });

    const [recentBookings] = await db.query(
      `SELECT b.id, b.total_price, b.status, b.created_at,
              u.username AS guest_name,
              r.room_type,
              h.name AS hotel_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN rooms r ON b.room_id = r.id
       JOIN hotels h ON r.hotel_id = h.id
       ORDER BY b.created_at DESC
       LIMIT 5`
    );

    const [monthly] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') month,
              COUNT(*) bookings,
              COALESCE(SUM(total_price), 0) revenue
       FROM bookings
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month
       ORDER BY month`
    );

    res.json({
      status: "success",
      data: {
        totalHotels, totalRooms, totalBookings, totalUsers,
        totalRevenue,
        statusCounts: counts,
        recentBookings,
        monthlyData: monthly,
      },
    });
  } catch (err) {
    console.log("Dashboard stats error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
