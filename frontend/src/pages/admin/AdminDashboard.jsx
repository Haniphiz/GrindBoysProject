import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import styles from "./AdminDashboard.module.css";

const API = "http://localhost:3000/api/admin";
const FORMAT_RUPIAH = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;
const FORMAT_DATE = (s) => {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};
const FORMAT_TIME = (s) => {
  if (!s) return "";
  return new Date(s).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const STATUS_MAP = {
  pending: { label: "Menunggu", color: "#D97706", bg: "#FFFBEB" },
  confirmed: { label: "Disetujui", color: "#1B6B4A", bg: "#ECFDF5" },
  checked_in: { label: "Check-in", color: "#1E40AF", bg: "#EFF6FF" },
  completed: { label: "Selesai", color: "#6B7280", bg: "#F3F4F6" },
  cancelled: { label: "Dibatalkan", color: "#9B2226", bg: "#FEF2F2" },
  expired: { label: "Expired", color: "#9B2226", bg: "#FEF2F2" },
};

const STAT_CARDS = [
  {
    key: "totalHotels", label: "Total Hotel", icon: "🏨",
    gradient: "linear-gradient(135deg, #1E40AF, #3B82F6)",
    bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
  },
  {
    key: "totalRooms", label: "Total Kamar", icon: "🛏️",
    gradient: "linear-gradient(135deg, #1B6B4A, #059669)",
    bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
  },
  {
    key: "totalBookings", label: "Total Booking", icon: "📋",
    gradient: "linear-gradient(135deg, #B45309, #D97706)",
    bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
  },
  {
    key: "totalRevenue", label: "Total Revenue", icon: "💰", prefix: "Rp",
    gradient: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
    bg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
  },
];

function AnimatedCounter({ value, prefix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    const duration = 800;
    const start = performance.now();
    const from = 0;
    const to = Number(value);
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <>{prefix}{display.toLocaleString("id-ID")}</>;
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <div className={styles.loadingText}>Memuat data dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.errorWrap}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2 className={styles.errorTitle}>Gagal Memuat Data</h2>
        <p className={styles.errorText}>Pastikan backend berjalan dan coba refresh halaman.</p>
      </div>
    );
  }

  const statusData = Object.entries(STATUS_MAP)
    .filter(([key]) => stats.statusCounts[key])
    .map(([key, v]) => ({ name: v.label, value: stats.statusCounts[key], color: v.color }));

  const totalStatus = statusData.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.eyebrow}>Dashboard</p>
        <h1 className={styles.greeting}>Selamat Datang Kembali</h1>
        <p className={styles.date}>
          Ringkasan operasional hotel — {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((card) => {
          const val = stats[card.key];
          return (
            <div key={card.key} className={styles.statCard}>
              <div className={styles.statTop}>
                <div className={styles.statIcon} style={{ background: card.bg }}>
                  {card.icon}
                </div>
                <div className={styles.statLabel}>{card.label}</div>
              </div>
              <div className={styles.statValue}>
                <AnimatedCounter value={val} prefix={card.prefix ? `${card.prefix} ` : ""} />
              </div>
              <div className={styles.statBar} style={{ background: card.gradient }} />
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Revenue Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <div className={styles.chartTitle}>Revenue Overview</div>
              <div className={styles.chartSub}>6 bulan terakhir</div>
            </div>
            <div className={styles.chartRevenue}>{FORMAT_RUPIAH(stats.totalRevenue)}</div>
          </div>
          {stats.monthlyData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.monthlyData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}jt`} />
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #F0EBE3", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  formatter={(v) => [FORMAT_RUPIAH(v), "Revenue"]}
                  labelFormatter={(l) => `Bulan ${l}`}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A96E" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChart}>Belum ada data revenue</div>
          )}
        </div>

        {/* Status Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle} style={{ marginBottom: 20 }}>Status Booking</div>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={statusData} layout="vertical" barCategoryGap={8}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #F0EBE3", borderRadius: 10, fontSize: 12 }}
                    formatter={(v) => [v, "Jumlah"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className={styles.statusLegend}>
                {statusData.map((d) => (
                  <div key={d.name} className={styles.statusItem}>
                    <div className={styles.statusDot} style={{ background: d.color }} />
                    <span className={styles.statusName}>{d.name}</span>
                    <span className={styles.statusCount}>{d.value}</span>
                    <span className={styles.statusPercent}>({totalStatus > 0 ? Math.round(d.value / totalStatus * 100) : 0}%)</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyChart}>Belum ada data booking</div>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className={styles.recentCard}>
        <div className={styles.recentHeader}>
          <div>
            <div className={styles.recentTitle}>Booking Terbaru</div>
            <div className={styles.recentSub}>5 transaksi terakhir</div>
          </div>
          <Link to="/admin/bookings" className={styles.recentLink}>
            Lihat Semua →
          </Link>
        </div>
        {stats.recentBookings?.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tamu</th>
                  <th>Hotel</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b) => {
                  const s = STATUS_MAP[b.status] || { label: b.status, color: "#6B7280", bg: "#F3F4F6" };
                  return (
                    <tr key={b.id} className={styles.tableRow}>
                      <td className={styles.idCell}>#{b.id}</td>
                      <td className={styles.guestCell}>{b.guest_name}</td>
                      <td className={styles.hotelCell}>{b.hotel_name}</td>
                      <td className={styles.priceCell}>{FORMAT_RUPIAH(b.total_price)}</td>
                      <td>
                        <span className={styles.statusBadge} style={{ background: s.bg, color: s.color }}>
                          <span className={styles.statusDotSmall} style={{ background: s.color }} />
                          {s.label}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {FORMAT_DATE(b.created_at)}
                        <span className={styles.timeCell}>{FORMAT_TIME(b.created_at)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyRecent}>Belum ada booking terbaru</div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
