const db = require("../config/db");

// ➕ CREATE PAYMENT
const createPayment = async (req, res) => {
  try {

    const { booking_id, payment_method } = req.body;

    const user_id = req.user.id;

    // =========================
    // VALIDASI INPUT
    // =========================
    if (!booking_id || !payment_method) {
      return res.status(400).json({
        status: "error",
        message: "booking_id dan payment_method wajib diisi"
      });
    }

    // =========================
    // CEK BOOKING
    // =========================
    const [bookingRows] = await db.query(
      `
      SELECT *
      FROM bookings
      WHERE id = ?
      AND user_id = ?
      `,
      [booking_id, user_id]
    );

    // booking tidak ditemukan
    if (bookingRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan"
      });
    }

    const booking = bookingRows[0];

    // =========================
    // CEK STATUS BOOKING
    // =========================
    if (booking.status !== "pending") {
      return res.status(400).json({
        status: "error",
        message: "Booking tidak bisa dibayar"
      });
    }

    // =========================
    // CEK PAYMENT DUPLIKAT
    // =========================
    const [existingPayment] = await db.query(
      `
      SELECT *
      FROM payments
      WHERE booking_id = ?
      `,
      [booking_id]
    );

    if (existingPayment.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Payment sudah dilakukan"
      });
    }

    // =========================
    // GENERATE PAYMENT REFERENCE
    // =========================
    const payment_reference =
      "PAY-" + Date.now();

    // =========================
    // STATUS PAYMENT
    // =========================
    const payment_status = "waiting_verification";

    // =========================
    // INSERT PAYMENT
    // =========================
    const [paymentResult] = await db.query(
      `
      INSERT INTO payments
      (
        booking_id,
        amount,
        payment_method,
        payment_reference,
        status
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        booking_id,
        booking.total_price,
        payment_method,
        payment_reference,
        payment_status
      ]
    );

    // =========================
    // RESPONSE
    // =========================
    res.status(201).json({
      status: "success",
      message: "Payment berhasil dikirim, menunggu verifikasi admin",
      data: {
        payment_id: paymentResult.insertId,
        booking_id,
        payment_reference,
        payment_method,
        amount: Number(booking.total_price),
        payment_status,
        booking_status: booking.status
      }
    });

  } catch (error) {

    console.error("PAYMENT ERROR:", error);

    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

// ✅ VERIFY PAYMENT ADMIN
const verifyPayment = async (req, res) => {
  try {

    const payment_id = req.params.id;

    const { status } = req.body;

    // =========================
    // VALIDASI STATUS
    // =========================
    const allowedStatus = ["paid", "failed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Status harus paid atau failed"
      });
    }

    // =========================
    // CEK PAYMENT
    // =========================
    const [paymentRows] = await db.query(
      `
      SELECT *
      FROM payments
      WHERE id = ?
      `,
      [payment_id]
    );

    if (paymentRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Payment tidak ditemukan"
      });
    }

    const payment = paymentRows[0];

    // =========================
    // CEK PAYMENT SUDAH VERIFIED
    // =========================
    if (
      payment.status === "paid" ||
      payment.status === "failed"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Payment sudah diverifikasi"
      });
    }

    // =========================
    // UPDATE PAYMENT STATUS
    // =========================
    await db.query(
      `
      UPDATE payments
      SET
        status = ?,
        verified_at = NOW()
      WHERE id = ?
      `,
      [status, payment_id]
    );

    // =========================
    // UPDATE BOOKING STATUS
    // =========================
    let bookingStatus = "pending";

    // approve payment
    if (status === "paid") {
      bookingStatus = "confirmed";
    }

    // reject payment
    if (status === "failed") {
      bookingStatus = "cancelled";
    }

    await db.query(
      `
      UPDATE bookings
      SET status = ?
      WHERE id = ?
      `,
      [bookingStatus, payment.booking_id]
    );

    // =========================
    // RESPONSE
    // =========================
    res.json({
      status: "success",
      message: "Payment berhasil diverifikasi",
      data: {
        payment_id: payment.id,
        payment_status: status,
        booking_status: bookingStatus,
        verified_at: new Date()
      }
    });

  } catch (error) {

    console.error("VERIFY PAYMENT ERROR:", error);

    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server"
    });
  }
};

module.exports = {
  createPayment,
  verifyPayment
};