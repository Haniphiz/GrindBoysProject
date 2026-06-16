import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Booking.module.css";

// ═══════════════════════════════════════
// MOCK DATA — Ganti nanti dengan API call
// ═══════════════════════════════════════
const MOCK_BOOKINGS = [
  {
    id: 1,
    hotel_name: "The Grand Majapahit",
    hotel_image: "https://picsum.photos/seed/hotel1/400/300.jpg",
    hotel_city: "Surabaya",
    room_type: "Deluxe Room",
    check_in: "2026-06-20",
    check_out: "2026-06-23",
    nights: 3,
    total_price: 1887000,
    status: "paid",
    payment_method: "QRIS",
    booking_code: "RSV-2026061601",
    created_at: "2026-06-16T14:32:00",
  },
  {
    id: 2,
    hotel_name: "Hotel Indonesia Kempinski",
    hotel_image: "https://picsum.photos/seed/hotel2/400/300.jpg",
    hotel_city: "Jakarta",
    room_type: "Superior Room",
    check_in: "2026-07-05",
    check_out: "2026-07-07",
    nights: 2,
    total_price: 2450000,
    status: "pending",
    payment_method: null,
    booking_code: "RSV-2026062002",
    created_at: "2026-06-20T10:15:00",
  },
  {
    id: 3,
    hotel_name: "Aston Denpasar Hotel",
    hotel_image: "https://picsum.photos/seed/hotel3/400/300.jpg",
    hotel_city: "Bali",
    room_type: "Standard Room",
    check_in: "2026-05-10",
    check_out: "2026-05-12",
    nights: 2,
    total_price: 980000,
    status: "completed",
    payment_method: "Transfer Bank",
    booking_code: "RSV-2026050803",
    created_at: "2026-05-08T09:00:00",
  },
  {
    id: 4,
    hotel_name: "Pullman Jakarta Central Park",
    hotel_image: "https://picsum.photos/seed/hotel4/400/300.jpg",
    hotel_city: "Jakarta",
    room_type: "Executive Suite",
    check_in: "2026-04-01",
    check_out: "2026-04-03",
    nights: 2,
    total_price: 3200000,
    status: "cancelled",
    payment_method: null,
    booking_code: "RSV-2026032804",
    created_at: "2026-03-28T16:45:00",
  },
  {
    id: 5,
    hotel_name: "Mercure Surabaya",
    hotel_image: "https://picsum.photos/seed/hotel5/400/300.jpg",
    hotel_city: "Surabaya",
    room_type: "Deluxe Room",
    check_in: "2026-05-20",
    check_out: "2026-05-22",
    nights: 2,
    total_price: 1150000,
    status: "completed",
    payment_method: "QRIS",
    booking_code: "RSV-2026051805",
    created_at: "2026-05-18T11:20:00",
  },
];

// ═══════════════════════════════════════
// HELPER
// ═══════════════════════════════════════
const formatPrice = (price) => {
  if (!price) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Status config
const STATUS_CONFIG = {
  pending: {
    label: "Menunggu Pembayaran",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  paid: {
    label: "Terverifikasi",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  active: {
    label: "Aktif",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  completed: {
    label: "Selesai",
    color: "#64748b",
    bg: "#f8fafc",
    border: "#e2e8f0",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
  },
};

export default function Booking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("aktif");
  const [bookings, setBookings] = useState([]);

  // ── Fetch data (sekarang pakai mock, nanti ganti API) ──
  useEffect(() => {
    // TODO: Ganti dengan API call
    // fetch("/api/bookings", { headers: { Authorization: `Bearer ${token}` } })
    //   .then(res => res.json())
    //   .then(data => setBookings(data));
    setBookings(MOCK_BOOKINGS);
  }, []);

  // ── Filter berdasarkan tab ──
  const filtered = bookings.filter((b) => {
    if (activeTab === "aktif") return b.status === "pending" || b.status === "paid" || b.status === "active";
    if (activeTab === "selesai") return b.status === "completed";
    if (activeTab === "batal") return b.status === "cancelled";
    return true;
  });

  // ── Hitung badge per tab ──
  const countAktif = bookings.filter((b) => b.status === "pending" || b.status === "paid" || b.status === "active").length;
  const countSelesai = bookings.filter((b) => b.status === "completed").length;
  const countBatal = bookings.filter((b) => b.status === "cancelled").length;

  // ── Tab config ──
  const tabs = [
    { key: "aktif", label: "Aktif", count: countAktif },
    { key: "selesai", label: "Selesai", count: countSelesai },
    { key: "batal", label: "Dibatalkan", count: countBatal },
  ];

  // ── Action handler ──
  const handleAction = (booking) => {
    if (booking.status === "pending") {
      // Lanjutkan pembayaran
      navigate("/payment", {
        state: {
          bookingId: booking.id,
          hotel: {
            name: booking.hotel_name,
            image_url: booking.hotel_image,
            city: booking.hotel_city,
          },
          room: {
            type: booking.room_type,
            price: Math.round(booking.total_price / booking.nights),
          },
          formData: {
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            nights: booking.nights,
            roomType: booking.room_type,
          },
          grandTotal: booking.total_price,
          bookingCode: booking.booking_code,
        },
      });
    } else if (booking.status === "paid" || booking.status === "active" || booking.status === "completed") {
      // Lihat e-voucher / struk
      navigate("/payment-success", {
        state: {
          payment: {
            payment_id: booking.booking_code,
            payment_method: booking.payment_method || "-",
            paid_at: booking.created_at,
          },
          hotel: {
            name: booking.hotel_name,
            image_url: booking.hotel_image,
            city: booking.hotel_city,
          },
          formData: {
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            nights: booking.nights,
            roomType: booking.room_type,
          },
          grandTotal: booking.total_price,
        },
      });
    }
  };

  const getActionButton = (status) => {
    switch (status) {
      case "pending":
        return { text: "Lanjutkan Pembayaran", variant: "warning" };
      case "paid":
      case "active":
        return { text: "Lihat E-Voucher", variant: "success" };
      case "completed":
        return { text: "Lihat Struk", variant: "outline" };
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Pemesanan Saya</h2>
        <p className={styles.subtitle}>
          Kelola tiket hotel, e-voucher, dan riwayat transaksi kamu.
        </p>

        {/* ═══ TABS ═══ */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`${styles.badge} ${activeTab === tab.key ? styles.badgeActive : ""}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══ LIST BOOKING ═══ */}
        <div className={styles.list}>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h3 className={styles.emptyTitle}>
                {activeTab === "aktif" && "Belum ada pemesanan aktif"}
                {activeTab === "selesai" && "Belum ada riwayat menginap"}
                {activeTab === "batal" && "Tidak ada pesanan dibatalkan"}
              </h3>
              <p className={styles.emptyText}>
                {activeTab === "aktif" && "Yuk cari hotel dan pesan kamar sekarang!"}
                {activeTab === "selesai" && "Pesanan yang sudah selesai akan muncul di sini."}
                {activeTab === "batal" && "Pesanan yang dibatalkan akan muncul di sini."}
              </p>
              {activeTab === "aktif" && (
                <button
                  className={styles.btnExplore}
                  onClick={() => navigate("/")}
                >
                  Cari Hotel
                </button>
              )}
            </div>
          ) : (
            filtered.map((booking) => {
              const statusCfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.completed;
              const actionBtn = getActionButton(booking.status);

              return (
                <div
                  key={booking.id}
                  className={`${styles.bookingCard} ${booking.status === "cancelled" ? styles.cardCancelled : ""}`}
                >
                  {/* ── Baris atas: Hotel info ── */}
                  <div className={styles.bookingTop}>
                    <img
                      src={booking.hotel_image}
                      alt={booking.hotel_name}
                      className={styles.bookingImg}
                    />
                    <div className={styles.bookingInfo}>
                      <h3 className={styles.bookingName}>{booking.hotel_name}</h3>
                      <p className={styles.bookingLocation}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {booking.hotel_city}
                      </p>
                      <span
                        className={styles.roomBadge}
                      >
                        {booking.room_type}
                      </span>
                    </div>
                  </div>

                  {/* ── Baris tanggal ── */}
                  <div className={styles.bookingDates}>
                    <div className={styles.dateBlock}>
                      <span className={styles.dateLabel}>Check-in</span>
                      <span className={styles.dateValue}>{formatDate(booking.check_in)}</span>
                    </div>
                    <div className={styles.dateArrow}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                      <span className={styles.nightsLabel}>{booking.nights} malam</span>
                    </div>
                    <div className={styles.dateBlock}>
                      <span className={styles.dateLabel}>Check-out</span>
                      <span className={styles.dateValue}>{formatDate(booking.check_out)}</span>
                    </div>
                  </div>

                  {/* ── Baris bawah: harga, status, aksi ── */}
                  <div className={styles.bookingBottom}>
                    <div className={styles.bookingLeft}>
                      <span
                        className={styles.statusBadge}
                        style={{
                          color: statusCfg.color,
                          background: statusCfg.bg,
                          borderColor: statusCfg.border,
                        }}
                      >
                        {statusCfg.label}
                      </span>
                      <span className={styles.bookingCode}>{booking.booking_code}</span>
                    </div>
                    <div className={styles.bookingRight}>
                      <span className={styles.bookingPrice}>
                        {formatPrice(booking.total_price)}
                      </span>
                      {actionBtn && (
                        <button
                          className={`${styles.btnAction} ${styles[actionBtn.variant]}`}
                          onClick={() => handleAction(booking)}
                        >
                          {actionBtn.text}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}