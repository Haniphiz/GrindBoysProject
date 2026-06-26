import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Home.css";

const allHotels = [
  {
    id: 1,
    name: "The Grand Majapahit",
    location: "Surabaya, Jawa Timur",
    price: 850000,
    rating: 4.9,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    tag: "Populer",
  },
  {
    id: 2,
    name: "Ayana Resort Bali",
    location: "Jimbaran, Bali",
    price: 2400000,
    rating: 4.8,
    reviews: 541,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    tag: "Mewah",
  },
  {
    id: 3,
    name: "Bromo Highland Hotel",
    location: "Probolinggo, Jawa Timur",
    price: 620000,
    rating: 4.7,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    tag: "Alam",
  },
  {
    id: 4,
    name: "Labuan Bajo Dive Lodge",
    location: "Labuan Bajo, NTT",
    price: 1100000,
    rating: 4.8,
    reviews: 275,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    tag: "Petualangan",
  },
  {
    id: 5,
    name: "Hotel Tentrem Yogyakarta",
    location: "Yogyakarta, DIY",
    price: 980000,
    rating: 4.8,
    reviews: 430,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
    tag: "Populer",
  },
  {
    id: 6,
    name: "The Mulia Bali",
    location: "Nusa Dua, Bali",
    price: 3200000,
    rating: 4.9,
    reviews: 612,
    image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80",
    tag: "Mewah",
  },
  {
    id: 7,
    name: "Alila Solo",
    location: "Solo, Jawa Tengah",
    price: 750000,
    rating: 4.6,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    tag: "Butik",
  },
  {
    id: 8,
    name: "Santika Premiere Jakarta",
    location: "Jakarta Pusat, DKI Jakarta",
    price: 890000,
    rating: 4.5,
    reviews: 388,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    tag: "Bisnis",
  },
];

const destinations = [
  { name: "Bali", hotels: 420, img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80" },
  { name: "Jakarta", hotels: 315, img: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&q=80" },
  { name: "Lombok", hotels: 180, img: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&q=80" },
  { name: "Yogyakarta", hotels: 240, img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&q=80" },
];

export default function Home() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState(2);

  // State hasil pencarian
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const resultsRef = useRef(null);

  const formatPrice = (price) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  // ── Fungsi Cari Hotel ──
  const handleSearch = () => {
    const query = location.trim().toLowerCase();
    const filtered = allHotels.filter((h) => {
      if (!query) return true;
      return (
        h.location.toLowerCase().includes(query) ||
        h.name.toLowerCase().includes(query)
      );
    });
    setSearchResults(filtered);
    setSearchQuery(location.trim());

    // Scroll ke hasil
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Klik destinasi populer langsung cari
  const handleDestinationClick = (destName) => {
    setLocation(destName);
    const query = destName.toLowerCase();
    const filtered = allHotels.filter((h) =>
      h.location.toLowerCase().includes(query) || h.name.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
    setSearchQuery(destName);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Reset pencarian
  const handleReset = () => {
    setSearchResults(null);
    setSearchQuery("");
    setLocation("");
    setCheckIn("");
    setCheckOut("");
    setGuests(2);
  };

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__overlay" />
        <div className="hero__content animate-fade-up">
          <span className="hero__badge">✦ Temukan Penginapan Impian Anda</span>
          <h1 className="hero__title">
            Setiap Perjalanan<br />
            <em>Dimulai dari Sini</em>
          </h1>
          <p className="hero__sub">
            Ribuan pilihan hotel terbaik di seluruh Indonesia, harga terjangkau, pemesanan mudah.
          </p>

          {/* Search Card */}
          <div className="search-card">
            <div className="search-card__field">
              <label>Destinasi</label>
              <input
                type="text"
                placeholder="Cari kota atau hotel..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
            <button className="search-card__btn" onClick={handleSearch}>
              🔍 Cari Hotel
            </button>
          </div>
        </div>
      </section>

      {/* ── HASIL PENCARIAN (muncul setelah klik cari) ── */}
      {searchResults !== null && (
        <section className="section section--alt" ref={resultsRef}>
          <div className="section__header animate-fade-up">
            <div>
              <p className="section__eyebrow">Hasil Pencarian</p>
              <h2 className="section__title">
                {searchQuery ? `Hotel di "${searchQuery}"` : "Semua Hotel"}
                <span style={{ fontSize: "1rem", fontWeight: 400, color: "#888", marginLeft: "0.75rem" }}>
                  {searchResults.length} hotel ditemukan
                </span>
              </h2>
              {(checkIn || checkOut) && (
                <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                  {checkIn && `Check-in: ${checkIn}`}{checkIn && checkOut && " · "}{checkOut && `Check-out: ${checkOut}`} · {guests} Tamu
                </p>
              )}
            </div>
            <button
              onClick={handleReset}
              style={{
                background: "none",
                border: "1.5px solid #ddd",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "#555",
              }}
            >
              ✕ Reset
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0", color: "#888" }}>
              <p style={{ fontSize: "3rem" }}>🏨</p>
              <p style={{ fontSize: "1.1rem" }}>Tidak ada hotel yang cocok dengan pencarian Anda.</p>
              <p>Coba kata kunci lain seperti "Bali", "Jakarta", atau nama hotel.</p>
            </div>
          ) : (
            <div className="hotels-grid">
              {searchResults.map((h) => (
                <div className="hotel-card" key={h.id}>
                  <div className="hotel-card__img-wrap">
                    <img src={h.image} alt={h.name} loading="lazy" />
                    <span className="hotel-card__tag">{h.tag}</span>
                    <button className="hotel-card__wishlist" aria-label="Simpan">♡</button>
                  </div>
                  <div className="hotel-card__body">
                    <div className="hotel-card__meta">
                      <span className="hotel-card__rating">★ {h.rating}</span>
                      <span className="hotel-card__reviews">({h.reviews} ulasan)</span>
                    </div>
                    <h3 className="hotel-card__name">{h.name}</h3>
                    <p className="hotel-card__location">📍 {h.location}</p>
                    <div className="hotel-card__footer">
                      <div>
                        <span className="hotel-card__price">{formatPrice(h.price)}</span>
                        <span className="hotel-card__per"> / malam</span>
                      </div>
                      <button
                        className="hotel-card__btn"
                        onClick={() => navigate("/payment", { state: { hotel: h } })}
                      >
                        Pesan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stats__inner animate-fade-up delay-1">
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
        <div className="section__header animate-fade-up delay-2">
          <div>
            <p className="section__eyebrow">Jelajahi Indonesia</p>
            <h2 className="section__title">Destinasi Terpopuler</h2>
          </div>
          <Link to="/hotel" className="section__link">Lihat Semua →</Link>
        </div>
        <div className="destinations">
          {destinations.map((d) => (
            <div
              className="dest-card"
              key={d.name}
              onClick={() => handleDestinationClick(d.name)}
              style={{ cursor: "pointer" }}
            >
              <img src={d.img} alt={d.name} loading="lazy" />
              <div className="dest-card__info">
                <strong>{d.name}</strong>
                <span>{d.hotels} hotel</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOTEL UNGGULAN (sembunyikan jika sedang menampilkan hasil pencarian) ── */}
      {searchResults === null && (
        <section className="section section--alt">
          <div className="section__header animate-fade-up delay-3">
            <div>
              <p className="section__eyebrow">Pilihan Editor</p>
              <h2 className="section__title">Hotel Unggulan</h2>
            </div>
            <Link to="/hotel" className="section__link">Lihat Semua →</Link>
          </div>
          <div className="hotels-grid">
            {allHotels.slice(0, 4).map((h) => (
              <div className="hotel-card" key={h.id}>
                <div className="hotel-card__img-wrap">
                  <img src={h.image} alt={h.name} loading="lazy" />
                  <span className="hotel-card__tag">{h.tag}</span>
                  <button className="hotel-card__wishlist" aria-label="Simpan">♡</button>
                </div>
                <div className="hotel-card__body">
                  <div className="hotel-card__meta">
                    <span className="hotel-card__rating">★ {h.rating}</span>
                    <span className="hotel-card__reviews">({h.reviews} ulasan)</span>
                  </div>
                  <h3 className="hotel-card__name">{h.name}</h3>
                  <p className="hotel-card__location">📍 {h.location}</p>
                  <div className="hotel-card__footer">
                    <div>
                      <span className="hotel-card__price">{formatPrice(h.price)}</span>
                      <span className="hotel-card__per"> / malam</span>
                    </div>
                    <button className="hotel-card__btn" onClick={() => navigate("/payment", { state: { hotel: h } })}>Pesan</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── KENAPA GRINDBOYS ── */}
      <section className="section">
        <div className="section__header center animate-fade-up delay-4">
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
        <div className="cta-banner__content animate-fade-up delay-5">
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
