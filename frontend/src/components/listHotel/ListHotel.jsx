import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Ditambahkan untuk tombol aksi
import styles from "./ListHotel.module.css";

function ListHotel() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/hotels")
      .then((response) => {
        if (!response.ok) throw new Error("Gagal mengambil data hotel");
        return response.json();
      })
      .then((data) => {
        setHotels(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.spinner}></div>
        <p>Memuat daftar hotel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.errorIcon}>⚠️</span>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <p className={styles.headerSub}>Temukan Penginapan</p>
        <h1 className={styles.headerTitle}>Daftar Hotel</h1>
        <p className={styles.headerDesc}>Pilihan lengkap hotel dari berbagai kota untuk menginap</p>
      </div>

      {/* Grid Hotel - Menggunakan desain kartu yang sama persis dengan Home */}
      <div className={styles.hotelGrid}>
        {hotels.map((hotel) => (
          <div className={styles.card} key={hotel.id}>
            
            {/* Wrap Gambar - Mirip hotel-card__img-wrap */}
            <div className={styles.cardImgWrap}>
              <img
                src={hotel.image_url || "https://via.placeholder.com/400x250?text=No+Image"}
                alt={hotel.name}
                loading="lazy"
              />
              <button className={styles.cardWishlist} aria-label="Simpan">♡</button>
            </div>
            
            {/* Body - Mirip hotel-card__body */}
            <div className={styles.cardBody}>
              
              {/* Meta - Diisi kota sebagai info utama */}
              <div className={styles.cardMeta}>
                <span className={styles.cardCity}>📍 {hotel.city}</span>
                <span className={styles.cardDate}>{new Date(hotel.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>

              <h3 className={styles.cardName}>{hotel.name}</h3>
              
              {/* Deskripsi Singkat - Digabungkan dengan alamat agar tidak kepanjangan */}
              <p className={styles.cardLocation}>
                {hotel.address}
              </p>

              {/* Footer - Tombol Aksi */}
              <div className={styles.cardFooter}>
                <div className={styles.cardPriceInfo}>
                  <span className={styles.cardLabel}>Hubungi untuk Info Harga</span>
                </div>
                <button 
                  className={styles.cardBtn} 
                  onClick={() => navigate("/payment", { state: { hotel } })}
                >
                  Pesan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListHotel;