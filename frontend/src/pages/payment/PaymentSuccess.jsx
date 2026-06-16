import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Pesan.module.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { payment, hotel, formData, grandTotal } = location.state || {};

  if (!payment) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2>Pembayaran Tidak Ditemukan</h2>
          <p className={styles.subtitle}>
            Halaman ini harus diakses dari halaman pembayaran.
          </p>
          <button className={styles.btnBack} onClick={() => navigate("/")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // ── Helpers ──
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
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDay = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("id-ID", { weekday: "long" });
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ── Derived data ──
  const checkIn = formData?.checkIn || formData?.check_in;
  const checkOut = formData?.checkOut || formData?.check_out;
  const nights =
    formData?.nights ||
    (checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
        )
      : 1);
  const adults = formData?.adults || formData?.guests || 2;
  const children = formData?.children || 0;
  const roomType = formData?.roomType || formData?.room_type || "Standard Room";
  const bookingDate = payment?.created_at || payment?.paid_at || new Date();
  const payDate = payment?.paid_at || new Date();
  const pricePerNight = grandTotal ? Math.round(grandTotal / nights) : 0;

  // Generate reservation number from payment id
  const refNum =
    payment.payment_id || payment.id || Math.random().toString(36).substring(2, 8).toUpperCase();
  const reservationNo = `RSV-${refNum}`;

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* ═══ HEADER ═══ */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2>Pembayaran Berhasil!</h2>
          <p className={styles.subtitle}>
            Pembayaran telah diterima. Konfirmasi akan<br />
            dikirim ke email kamu.
          </p>
        </div>

        {/* ═══ BODY ═══ */}
        <div className={styles.body}>

          {/* Detail Reservasi */}
          <p className={styles.sectionLabel}>Detail Reservasi</p>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                </svg>
                No. Reservasi
              </span>
              <span className={styles.infoValue}>{reservationNo}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Tanggal Pemesanan
              </span>
              <span className={styles.infoValue}>{formatDate(bookingDate)}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Tamu
              </span>
              <span className={styles.infoValue}>
                {adults} Dewasa{children > 0 ? `, ${children} Anak` : ""}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Durasi Menginap
              </span>
              <span className={`${styles.infoValue} ${styles.highlight}`}>
                {nights} Malam
              </span>
            </div>
          </div>

          {/* Tanggal Check-in & Check-out */}
          <p className={styles.sectionLabel}>Tanggal Menginap</p>
          <div className={styles.dateRow}>
            <div className={styles.dateBadge}>
              <div className={styles.dateBadgeLabel}>Check-in</div>
              <div className={styles.dateBadgeValue}>{formatDate(checkIn)}</div>
              <div className={styles.dateBadgeDay}>
                {formatDay(checkIn)}, 14:00
              </div>
            </div>
            <div className={styles.dateArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className={styles.dateBadge}>
              <div className={styles.dateBadgeLabel}>Check-out</div>
              <div className={styles.dateBadgeValue}>{formatDate(checkOut)}</div>
              <div className={styles.dateBadgeDay}>
                {formatDay(checkOut)}, 12:00
              </div>
            </div>
          </div>

          {/* Detail Hotel */}
          <p className={styles.sectionLabel}>Detail Hotel</p>
          <div className={styles.hotelCard}>
            {hotel?.image_url && (
              <img
                src={hotel.image_url}
                alt={hotel.name}
                className={styles.hotelImg}
              />
            )}
            <div className={styles.hotelInfo}>
              <span className={styles.roomBadge}>{roomType}</span>
              <h3>{hotel?.name || "-"}</h3>
              <p className={styles.hotelLocation}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {hotel?.city || "-"}{hotel?.address ? ` - ${hotel.address}` : ""}
              </p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Rincian Harga */}
          <p className={styles.sectionLabel}>Rincian Pembayaran</p>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>
              {formatPrice(pricePerNight)} × {nights} malam
            </span>
            <span className={styles.priceValue}>{formatPrice(grandTotal)}</span>
          </div>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Pajak & biaya layanan</span>
            <span className={styles.priceValue}>Rp 0</span>
          </div>

          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>Total Pembayaran</span>
            <span className={styles.totalValue}>{formatPrice(grandTotal)}</span>
          </div>

          <div className={styles.divider} />

          {/* Bukti Pembayaran */}
          <p className={styles.sectionLabel}>Bukti Pembayaran</p>
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                Metode Bayar
              </span>
              <span className={styles.infoValue}>
                {(payment.payment_method || "-").toUpperCase()}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                No. Referensi
              </span>
              <span className={styles.infoValue}>{refNum}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Tanggal Bayar
              </span>
              <span className={styles.infoValue}>
                {formatDate(payDate)}, {formatTime(payDate)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Status
              </span>
              <span className={`${styles.infoValue} ${styles.highlight}`}>
                ✓ Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className={styles.footer}>
          <p className={styles.footerNote}>
            Simpan struk ini sebagai bukti reservasi Anda.<br />
            Tunjukkan saat check-in di hotel.
          </p>
          <button className={styles.btnDownload}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Unduh Struk
          </button>
          <button className={styles.btnBack} onClick={() => navigate("/")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Kembali ke Beranda
          </button>
        </div>

      </div>
    </div>
  );
}