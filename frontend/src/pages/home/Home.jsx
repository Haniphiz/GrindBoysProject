import { useState, useEffect } from "react";
import "./Home.css";

const destinations = [
  { name: "Bali", hotels: 420, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
  { name: "Jakarta", hotels: 315, img: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&q=80" },
  { name: "Lombok", hotels: 180, img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80" },
  { name: "Yogyakarta", hotels: 240, img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80" },
];

export default function Home() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(2);
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/hotels/featured")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setFeaturedHotels(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch hotel:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content">
          <span className="hero__badge">✦ Temukan Penginapan Impian Anda</span>
          <h1 className="hero__title">
            Setiap Perjalanan<br />
            <em>Dimulai dari Sini</em>
          </h1>
          <p className="hero__sub">
            Ribuan pilihan hotel terbaik di seluruh Indonesia, harga terjangkau, pemesanan mudah.
          </p>

          <div className="search-card">
            <div className="search-card__field">
              <label>Destinasi</label>
              <input
                type="text"
                placeholder="Cari kota atau hotel..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="search-card__divider" />
            <div className="search-card__field">
              <label>Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div className="search-card__divider" />
            <div className="search-card__field">
              <label>Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
            <div className="search-card__divider" />
            <div className="search-card__field">
              <label>Tamu</label>
              <div className="guests-control">
                <button onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                <span>{guests} Tamu</span>
                <button onClick={() => setGuests(guests + 1)}>+</button>
              </div>
            </div>
            <button className="search-card__btn">🔍 Cari Hotel</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stats__inner">
          {[
            { value: "10.000+", label: "Hotel Tersedia" },
            { value: "1 Juta+", label: "Pelanggan Puas" },
            { value: "500+", label: "Kota di Indonesia" },
            { value: "4.9★", label: "Rating Rata-rata" },
          ].map((s) => (
            <div className="stats__item" key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── DESTINASI POPULER ── */}
      <section className="section">
        <div className="section__header">
          <div>
            <p className="section__eyebrow">Jelajahi Indonesia</p>
            <h2 className="section__title">Destinasi Terpopuler</h2>
          </div>
          <a href="#" className="section__link">Lihat Semua →</a>
        </div>
        <div className="destinations">
          {destinations.map((d) => (
            <div className="dest-card" key={d.name}>
              <img src={d.img} alt={d.name} />
              <div className="dest-card__info">
                <strong>{d.name}</strong>
                <span>{d.hotels} hotel</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOTEL UNGGULAN ── */}
      <section className="section section--alt">
        <div className="section__header">
          <div>
            <p className="section__eyebrow">Pilihan Editor</p>
            <h2 className="section__title">Hotel Unggulan</h2>
          </div>
          <a href="#" className="section__link">Lihat Semua →</a>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#888" }}>Memuat hotel...</p>
        ) : featuredHotels.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>Belum ada hotel tersedia.</p>
        ) : (
          <div className="hotels-grid">
            {featuredHotels.map((h) => (
              <div className="hotel-card" key={h.id}>
                <div className="hotel-card__img-wrap">
                  <img
                    src={h.image_url || "https://via.placeholder.com/400x250?text=No+Image"}
                    alt={h.name}
                  />
                  <span className="hotel-card__tag">{h.city}</span>
                  <button className="hotel-card__wishlist" aria-label="Simpan">♡</button>
                </div>
                <div className="hotel-card__body">
                  <h3 className="hotel-card__name">{h.name}</h3>
                  <p className="hotel-card__location">📍 {h.city}</p>
                  <p className="hotel-card__location">{h.address}</p>
                  <div className="hotel-card__footer">
                    <button className="hotel-card__btn">Lihat Detail</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── KENAPA GRINDBOYS ── */}
      <section className="section">
        <div className="section__header center">
          <div>
            <p className="section__eyebrow">Keunggulan Kami</p>
            <h2 className="section__title">Mengapa Memilih GrindBoys?</h2>
          </div>
        </div>
        <div className="features">
          {[
            { icon: "🛡️", title: "Terpercaya & Aman", desc: "Sistem pembayaran terenkripsi dan data Anda selalu terlindungi." },
            { icon: "💰", title: "Harga Terbaik", desc: "Jaminan harga termurah. Temukan lebih murah? Kami refund selisihnya." },
            { icon: "⚡", title: "Booking Instan", desc: "Konfirmasi pemesanan dalam hitungan detik, langsung ke email Anda." },
            { icon: "🎧", title: "Dukungan 24/7", desc: "Tim customer service kami siap membantu kapan saja Anda membutuhkan." },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-card__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-banner__content">
          <h2>Dapatkan Diskon 20% untuk Pemesanan Pertama!</h2>
          <p>Daftar sekarang dan nikmati penawaran eksklusif untuk member baru GrindBoys.</p>
          <div className="cta-banner__actions">
            <button className="cta-banner__btn primary">Daftar Gratis</button>
            <button className="cta-banner__btn outline">Pelajari Lebih Lanjut</button>
          </div>
        </div>
      </section>
    </main>
  );
}
