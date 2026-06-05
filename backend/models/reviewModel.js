const db = require("../config/db");

const createReview = async (
  user_id,
  hotel_id,
  booking_id,
  rating,
  comment
) => {
  const [result] = await db.query(
    `INSERT INTO reviews
    (user_id, hotel_id, booking_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)`,
    [user_id, hotel_id, booking_id, rating, comment]
  );

  return result;
};

const getReviewsByHotel = async (hotel_id) => {
  const [rows] = await db.query(
    `SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.hotel_id = ?
    ORDER BY r.created_at DESC`,
    [hotel_id]
  );

  return rows;
};

module.exports = {
  createReview,
  getReviewsByHotel
};