import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:3000";

// ── Helper ──
const formatRupiah = (num) =>
  "Rp " + Number(num).toLocaleString("id-ID");

const formatDate = (str) => {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const hitungMalam = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Status dari DB: pending, confirmed, completed, cancelled
// Mapping ke tampilan Indonesia
const STATUS_CONFIG = {
  pending:   { label: "Menunggu Konfirmasi", bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  confirmed: { label: "Aktif",               bg: "#DBEAFE", color: "#1D4ED8", dot: "#2563EB" },
  completed: { label: "Selesai",             bg: "#D1FAE5", color: "#065F46", dot: "#059669" },
  cancelled: { label: "Dibatalkan",          bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};

const FILTER_OPTIONS = [
  { value: "semua",     label: "Semua" },
  { value: "confirmed", label: "Aktif" },
  { value: "pending",   label: "Menunggu" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const CATEGORY_BADGE = {
  VIP:       { label: "VIP",         color: "#7C3AED" },
  Deluxe:    { label: "MEWAH",       color: "#2563EB" },
  Standard:  { label: "POPULER",     color: "#059669" },
  Villa:     { label: "VILLA",       color: "#D97706" },
  Adventure: { label: "PETUALANGAN", color: "#DC2626" },
};

// ── Sub-components ──
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {cfg.label}
    </span>
  );
}

function BookingCard({ booking, onDetail, onCancel }) {
  const nights = hitungMalam(booking.check_in, booking.check_out);
  const badge = CATEGORY_BADGE[booking.room_type] || { label: booking.room_type, color: "#6B7280" };

  return (
    <div
      style={{
        background: "#fff", borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        overflow: "hidden", display: "flex", flexDirection: "column", transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(99,91,255,0.15)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)")}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", background: "#E5E7EB" }}>
        {booking.image_url ? (
          <img
            src={booking.image_url.startsWith("http") ? booking.image_url : `${API_URL}/${booking.image_url}`}
            alt={booking.hotel_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🏨</div>
        )}
        <span style={{
          position: "absolute", top: 12, left: 12,
          background: badge.color, color: "#fff",
          fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
        }}>
          {badge.label}
        </span>
        <span style={{ position: "absolute", top: 12, right: 12 }}>
          <StatusBadge status={booking.status} />
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          {booking.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ color: "#F59E0B", fontSize: 13 }}>★</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{booking.rating}</span>
            </div>
          )}
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>
            {booking.hotel_name || "Hotel"}
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "#6B7280" }}>
            📍 {booking.location || "-"}
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #F3F4F6", margin: "2px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: 13 }}>
          {[
            ["ID Pemesanan", `#${booking.booking_id}`],
            ["Tipe Kamar", booking.room_type || "-"],
            ["Check-in", formatDate(booking.check_in)],
            ["Check-out", formatDate(booking.check_out)],
            ["Durasi", nights > 0 ? `${nights} malam` : "-"],
            ["Dipesan pada", formatDate(booking.created_at)],
          ].map(([label, val]) => (
            <div key={label}>
              <span style={{ color: "#9CA3AF", display: "block", fontSize: 11, marginBottom: 2 }}>{label}</span>
              <span style={{ fontWeight: 600, color: "#374151" }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Harga */}
        <div style={{ background: "#F8F7FF", borderRadius: 10, padding: "10px 14px" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF", display: "block" }}>
            {formatRupiah(booking.price_per_night || booking.total_price)}
            {nights > 0 ? ` × ${nights} malam` : ""}
          </span>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#2563EB" }}>
            {formatRupiah(booking.total_price)}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <button
            onClick={() => onDetail(booking)}
            style={{
              flex: 1, background: "#2563EB", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#1D4ED8")}
            onMouseLeave={(e) => (e.target.style.background = "#2563EB")}
          >
            Lihat Detail
          </button>
          {(booking.status === "pending" || booking.status === "confirmed") && (
            <button
              onClick={() => onCancel(booking)}
              style={{
                flex: 1, background: "#fff", color: "#EF4444",
                border: "1.5px solid #EF4444", borderRadius: 8, padding: "10px 0",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#FEF2F2")}
              onMouseLeave={(e) => (e.target.style.background = "#fff")}
            >
              Batalkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal Detail ──
function DetailModal({ booking, onClose }) {
  if (!booking) return null;
  const nights = hitungMalam(booking.check_in, booking.check_out);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 20, maxWidth: 520, width: "100%", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: "relative", height: 200, background: "#E5E7EB" }}>
          {booking.image_url ? (
            <img
              src={booking.image_url.startsWith("http") ? booking.image_url : `${API_URL}/${booking.image_url}`}
              alt={booking.hotel_name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>🏨</div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontWeight: 700, fontSize: 16 }}
          >✕</button>
          <div style={{ position: "absolute", bottom: 14, left: 16, color: "#fff" }}>
            <div style={{ fontWeight: 800, fontSize: 20 }}>{booking.hotel_name}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>📍 {booking.location}</div>
          </div>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>ID: #{booking.booking_id}</span>
            <StatusBadge status={booking.status} />
          </div>

          {[
            ["Tipe Kamar", booking.room_type || "-"],
            ["Check-in", formatDate(booking.check_in)],
            ["Check-out", formatDate(booking.check_out)],
            ["Durasi", nights > 0 ? `${nights} malam` : "-"],
            ["Kapasitas", booking.capacity ? `${booking.capacity} orang` : "-"],
            ["Harga per Malam", formatRupiah(booking.price_per_night || 0)],
            ["Dipesan pada", formatDate(booking.created_at)],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6", fontSize: 14 }}>
              <span style={{ color: "#6B7280" }}>{label}</span>
              <span style={{ fontWeight: 600, color: "#111827" }}>{val}</span>
            </div>
          ))}

          <div style={{ marginTop: 16, background: "#EFF6FF", borderRadius: 12, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: "#1D4ED8", fontSize: 15 }}>Total Pembayaran</span>
            <span style={{ fontWeight: 800, color: "#2563EB", fontSize: 20 }}>{formatRupiah(booking.total_price)}</span>
          </div>

          <button
            onClick={onClose}
            style={{ marginTop: 16, width: "100%", background: "#2563EB", color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 15, cursor: "pointer" }}
          >Tutup</button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Cancel Modal ──
function CancelModal({ booking, onConfirm, onClose, loading }) {
  if (!booking) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 16, maxWidth: 400, width: "100%", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#111827" }}>Batalkan Pemesanan?</h3>
        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 4 }}>Kamu yakin ingin membatalkan pemesanan</p>
        <p style={{ color: "#111827", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>{booking.hotel_name}?</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{ flex: 1, background: "#F3F4F6", color: "#374151", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >Tidak</button>
          <button
            onClick={() => onConfirm(booking.booking_id)}
            disabled={loading}
            style={{ flex: 1, background: "#EF4444", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >{loading ? "Membatalkan..." : "Ya, Batalkan"}</button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ filter }) {
  const label = FILTER_OPTIONS.find(o => o.value === filter)?.label || "";
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🏨</div>
      <h3 style={{ color: "#374151", fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
        Belum ada pemesanan{filter !== "semua" ? ` dengan status "${label}"` : ""}
      </h3>
      <p style={{ fontSize: 14, margin: 0 }}>
        {filter === "semua" ? "Mulai pesan hotel impianmu sekarang!" : "Coba pilih filter lain."}
      </p>
    </div>
  );
}

// ── Main Page ──
export default function Booking() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("semua");
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch data dari API ──
  const fetchBookings = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      if (json.status === "success") {
        setBookings(json.data);
      } else {
        setError(json.message || "Gagal mengambil data");
      }
    } catch (err) {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  // ── Cancel booking ke API ──
  const handleCancel = async (bookingId) => {
    try {
      setCancelLoading(true);
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      if (json.status === "success") {
        setBookings((prev) =>
          prev.map((b) =>
            b.booking_id === bookingId ? { ...b, status: "cancelled" } : b
          )
        );
        showToast("Pemesanan berhasil dibatalkan.", "error");
      } else {
        showToast(json.message || "Gagal membatalkan pemesanan.", "error");
      }
    } catch (err) {
      showToast("Tidak dapat terhubung ke server.", "error");
    } finally {
      setCancelLoading(false);
      setCancelTarget(null);
    }
  };

  const filtered = filter === "semua" ? bookings : bookings.filter((b) => b.status === filter);

  const counts = {
    semua:     bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F7FF" }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: "#7C72E5", fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>
            Akun Saya
          </p>
          <h1 style={{ margin: "0 0 4px", fontSize: 30, fontWeight: 800, color: "#111827", letterSpacing: -0.5 }}>
            Riwayat Pemesanan
          </h1>
          <p style={{ color: "#6B7280", margin: 0, fontSize: 15 }}>
            Kelola semua pemesanan hotel kamu di satu tempat.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <p style={{ color: "#6B7280", fontSize: 15 }}>Memuat data pemesanan...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <p style={{ color: "#EF4444", fontSize: 15, fontWeight: 600 }}>{error}</p>
            <button
              onClick={fetchBookings}
              style={{ marginTop: 16, background: "#2563EB", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: "pointer" }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Data */}
        {!loading && !error && (
          <>
            {/* Summary cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
              {[
                { key: "semua",     label: "Total Booking", icon: "📋", color: "#7C72E5" },
                { key: "confirmed", label: "Aktif",         icon: "✅", color: "#2563EB" },
                { key: "pending",   label: "Menunggu",      icon: "⏳", color: "#D97706" },
                { key: "completed", label: "Selesai",       icon: "🏁", color: "#059669" },
                { key: "cancelled", label: "Dibatalkan",    icon: "❌", color: "#EF4444" },
              ].map((s) => (
                <div key={s.key} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{counts[s.key]}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  style={{
                    padding: "8px 18px", borderRadius: 20, border: "1.5px solid",
                    borderColor: filter === opt.value ? "#7C72E5" : "#E5E7EB",
                    background: filter === opt.value ? "#7C72E5" : "#fff",
                    color: filter === opt.value ? "#fff" : "#6B7280",
                    fontWeight: filter === opt.value ? 700 : 500,
                    fontSize: 14, cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  {opt.label}
                  <span style={{
                    marginLeft: 6,
                    background: filter === opt.value ? "rgba(255,255,255,0.25)" : "#F3F4F6",
                    color: filter === opt.value ? "#fff" : "#9CA3AF",
                    borderRadius: 10, padding: "1px 7px", fontSize: 12, fontWeight: 700,
                  }}>
                    {counts[opt.value]}
                  </span>
                </button>
              ))}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
                {filtered.map((booking) => (
                  <BookingCard
                    key={booking.booking_id}
                    booking={booking}
                    onDetail={setSelectedDetail}
                    onCancel={setCancelTarget}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <DetailModal booking={selectedDetail} onClose={() => setSelectedDetail(null)} />
      <CancelModal
        booking={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelLoading}
      />

      {toast && (
        <div style={{
          position: "fixed", bottom: 28, right: 28,
          background: toast.type === "error" ? "#EF4444" : "#059669",
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 2000,
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}