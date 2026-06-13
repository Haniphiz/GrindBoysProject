import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Global State (Slide 13)
import styles from "./Navbar.module.css"; // CSS Modules Wajib (Slide 8)

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // State untuk Scroll Hide/View (Slide 9: State)
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // State untuk Mobile Menu (Slide 9: State)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Effect untuk deteksi arah scroll (Slide 10: Effect Hook & Side Effect)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Jika scroll ke BAWAH dan sudah melewati 50px -> HIDE
      // Jika scroll ke ATAS -> SHOW
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Effect: Tutup mobile menu saat pindah halaman
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${!showNav ? styles.navHidden : ""}`}>
      <div className={styles.navContainer}>
        
        <Link to="/" className={styles.logo}>
          HotelBooking
        </Link>

        {/* Hamburger Menu (Muncul di HP) */}
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerActive : ""}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menu Links */}
        <ul className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksActive : ""}`}>
          <li><Link to="/" className={styles.link}>Home</Link></li>
          <li><Link to="/hotel" className={styles.link}>Hotel</Link></li>
          
          {/* Conditional Rendering: Login / Logout (Slide 12) */}
          {user ? (
            <>
              <li><Link to="/payment" className={styles.link}>Booking</Link></li>
              <li><button onClick={handleLogout} className={styles.linkBtn}>Logout</button></li>
            </>
          ) : (
            <li><Link to="/login" className={styles.linkBtn}>Login</Link></li>
          )}
        </ul>

      </div>
    </nav>
  );
}