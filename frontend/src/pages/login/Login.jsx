import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login gagal");

      login(data.token, data.user || { email: formData.email, role: "user" });
      navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* TOMBOL KEMBALI DI POJOK KIRI ATAS */}
      <button className={styles.btnBack} onClick={() => navigate(-1)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali
      </button>

      {/* BANNER KIRI */}
      <div className={styles.banner}>
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <h1>GrindBoys<br /><span>Hotel Booking</span></h1>
            <p>Pesan hotel terbaik di seluruh Indonesia dengan harga terjangkau dan proses mudah.</p>
            <div className={styles.bannerStats}>
              <div className={styles.statItem}>
                <strong>10K+</strong>
                <span>Hotel</span>
              </div>
              <div className={styles.statItem}>
                <strong>1M+</strong>
                <span>Pengguna</span>
              </div>
              <div className={styles.statItem}>
                <strong>4.9★</strong>
                <span>Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM KANAN */}
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          
          <div className={styles.mobileLogo}>
            <h2>HotelBooking</h2>
          </div>

          <div className={styles.header}>
            <h2>Selamat Datang</h2>
            <p>Masuk ke akun Anda untuk melanjutkan pemesanan</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}>✉️</span>
                <input 
                  id="email"
                  type="email" 
                  name="email" 
                  placeholder="nama@email.com" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.icon}>🔒</span>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Masukkan password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  autoComplete="current-password"
                />
                {/* TOMBOL HIDE/VIEW PAKE SVG HITAM STANDAR */}
                <button 
                  type="button" 
                  className={styles.togglePass} 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    // IKON MATA TERTUTUP (Slash)
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    // IKON MATA TERBUKA
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.forgotPass}>
              <a href="#">Lupa password?</a>
            </div>

            <button type="submit" className={styles.btnLogin} disabled={isLoading}>
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                "Masuk ke Akun"
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>ATAU</span>
          </div>

          <div className={styles.footer}>
            <p>Belum punya akun? 
              <Link to="/register"> Daftar Sekarang</Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}