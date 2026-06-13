const db = require("../config/db");

const Hotel = {

  // 🔍 Ambil semua hotel
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM hotels");
    return rows;
  },

  // 🌟 Ambil hotel unggulan untuk halaman utama
getFeatured: async () => {
  const [rows] = await db.query(
    "SELECT * FROM hotels ORDER BY id DESC LIMIT 4"
  );
  return rows;
},

  // 🔍 Ambil hotel by ID
  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM hotels WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  // 🔍 DETAIL HOTEL LENGKAP
  getDetail: async (id) => {

    // =========================
    // HOTEL
    // =========================
    const [hotelRows] = await db.query(
      "SELECT * FROM hotels WHERE id = ?",
      [id]
    );

    if (hotelRows.length === 0) {
      return null;
    }

    const hotel = hotelRows[0];

    // =========================
    // ROOMS
    // =========================
    const [roomRows] = await db.query(
      "SELECT * FROM rooms WHERE hotel_id = ?",
      [id]
    );

    // =========================
    // REVIEWS
    // =========================
    const [reviewRows] = await db.query(
      `
      SELECT
        reviews.id,
        reviews.rating,
        reviews.comment,
        reviews.created_at,
        users.username
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      WHERE reviews.hotel_id = ?
      ORDER BY reviews.created_at DESC
      `,
      [id]
    );

    // =========================
    // AVERAGE RATING
    // =========================
    let averageRating = 0;

    if (reviewRows.length > 0) {
      const totalRating = reviewRows.reduce(
        (sum, review) => sum + review.rating,
        0
      );

      averageRating = (
        totalRating / reviewRows.length
      ).toFixed(1);
    }

    // =========================
    // RETURN DATA
    // =========================
    return {
      hotel,
      average_rating: averageRating,
      total_reviews: reviewRows.length,
      rooms: roomRows,
      reviews: reviewRows
    };
  },

  // ➕ Tambah hotel
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO hotels (name, address, city, description, image_url)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.name,
        data.address,
        data.city,
        data.description,
        data.image_url
      ]
    );

    return result;
  },

  // ✏️ Update hotel
  update: async (id, data) => {
    const [result] = await db.query(
      `UPDATE hotels 
       SET name=?, address=?, city=?, description=?, image_url=?
       WHERE id=?`,
      [
        data.name,
        data.address,
        data.city,
        data.description,
        data.image_url,
        id
      ]
    );

    return result;
  },

  // ❌ Delete hotel
  delete: async (id) => {
    const [result] = await db.query(
      "DELETE FROM hotels WHERE id=?",
      [id]
    );

    return result;
  }
};

module.exports = Hotel;