const db = require("../config/db");

const Hotel = {

  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM hotels");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM hotels WHERE id = ?", [id]);
    return rows[0];
  },

  getDetail: async (id) => {
    const [hotelRows] = await db.query("SELECT * FROM hotels WHERE id = ?", [id]);
    if (hotelRows.length === 0) return null;

    const hotel = hotelRows[0];

    const [roomRows] = await db.query("SELECT * FROM rooms WHERE hotel_id = ?", [id]);

    const [reviewRows] = await db.query(
      `SELECT reviews.id, reviews.rating, reviews.comment, reviews.created_at, users.username
       FROM reviews JOIN users ON reviews.user_id = users.id
       WHERE reviews.hotel_id = ?
       ORDER BY reviews.created_at DESC`,
      [id]
    );

    let averageRating = 0;
    if (reviewRows.length > 0) {
      const totalRating = reviewRows.reduce((sum, r) => sum + r.rating, 0);
      averageRating = (totalRating / reviewRows.length).toFixed(1);
    }

    return {
      hotel,
      average_rating: averageRating,
      total_reviews: reviewRows.length,
      rooms: roomRows,
      reviews: reviewRows
    };
  },

  // ✅ FIX: tambah floors, rating, reviews
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO hotels (name, address, city, description, image_url, floors, rating, reviews)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.address,
        data.city,
        data.description,
        data.image_url,
        data.floors || 3,
        data.rating || 0,
        data.reviews || 0
      ]
    );
    return result;
  },

  // ✅ FIX: tambah floors, rating, reviews
  update: async (id, data) => {
    const [result] = await db.query(
      `UPDATE hotels
       SET name=?, address=?, city=?, description=?, image_url=?, floors=?, rating=?, reviews=?
       WHERE id=?`,
      [
        data.name,
        data.address,
        data.city,
        data.description,
        data.image_url,
        data.floors || 3,
        data.rating || 0,
        data.reviews || 0,
        id
      ]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM hotels WHERE id=?", [id]);
    return result;
  }
};

module.exports = Hotel;