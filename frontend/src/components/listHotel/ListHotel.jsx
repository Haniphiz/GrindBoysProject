import { useEffect, useState } from "react";
import styles from "./ListHotel.module.css";

function ListHotel() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/hotels")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Gagal mengambil data hotel");
        }
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
    return <h2 className={styles.message}>Loading...</h2>;
  }

  if (error) {
    return <h2 className={styles.error}>{error}</h2>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Daftar Hotel</h1>

      <div className={styles.hotelGrid}>
        {hotels.map((hotel) => (
          <div key={hotel.id} className={styles.card}>
            <img
              src={
                hotel.image_url ||
                "https://via.placeholder.com/400x250?text=No+Image"
              }
              alt={hotel.name}
              className={styles.image}
            />

            <div className={styles.cardBody}>
              <h2>{hotel.name}</h2>

              <p className={styles.city}>
                📍 {hotel.city}
              </p>

              <p>
                <strong>Alamat:</strong> {hotel.address}
              </p>

              <p className={styles.description}>
                {hotel.description}
              </p>

              <p className={styles.date}>
                Dibuat:
                {" "}
                {new Date(hotel.created_at).toLocaleDateString(
                  "id-ID"
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListHotel;