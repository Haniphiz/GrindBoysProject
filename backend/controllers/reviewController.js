const db = require("../config/db");
const Review = require("../models/reviewModel");

exports.addReview = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      booking_id,
      rating,
      comment
    } = req.body;

    if (!booking_id || !rating) {
      return res.status(400).json({
        status: "error",
        message: "booking_id dan rating wajib diisi"
      });
    }

    const [booking] = await db.query(
      `
      SELECT
        b.id,
        b.user_id,
        b.status,
        h.id AS hotel_id
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN hotels h ON r.hotel_id = h.id
      WHERE b.id = ?
      `,
      [booking_id]
    );

    if (booking.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan"
      });
    }

    if (booking[0].user_id !== user_id) {
      return res.status(403).json({
        status: "error",
        message: "Booking bukan milik Anda"
      });
    }

    if (booking[0].status !== "completed") {
      return res.status(400).json({
        status: "error",
        message: "Review hanya dapat diberikan setelah menginap selesai"
      });
    }

    const hotel_id = booking[0].hotel_id;

    await Review.createReview(
      user_id,
      hotel_id,
      booking_id,
      rating,
      comment
    );

    res.status(201).json({
      status: "success",
      message: "Review berhasil ditambahkan"
    });

  } catch (error) {

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        status: "error",
        message: "Booking ini sudah pernah direview"
      });
    }

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

exports.getReviewsByHotel = async (req, res) => {
  try {

    const hotel_id = req.params.hotelId;

    const reviews = await Review.getReviewsByHotel(hotel_id);

    res.json({
      status: "success",
      data: reviews
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};