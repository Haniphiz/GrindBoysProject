import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Global State
import styles from "./Navbar.module.css"; // CSS Modules

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // State untuk Scroll Hide/View
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // State untuk Mobile Menu & Profile Dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Ambil inisial huruf pertama dari username untuk avatar
  const getInitial = (username) => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false);
        setIsDropdownOpen(false); 
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${!showNav ? styles.navHidden : ""}`}>
      <div className={styles.navContainer}>
        
        <Link to="/" className={styles.logo}>
          HotelBooking
        </Link>

        {/* Hamburger Menu */}
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
          
          {user ? (
            <>
              <li><Link to="/booking" className={styles.link}>Booking</Link></li>
              
              {/* Profile Avatar Container */}
              <li className={styles.profileContainer} ref={dropdownRef}>
                <div 
                  className={styles.avatarBtn}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {getInitial(user.username)}
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <div className={styles.dropdownHeader}>
                      <span className={styles.dropdownName}>{user.username || "User"}</span>
                      <span className={styles.dropdownEmail}>{user.email || "user@mail.com"}</span>
                    </div>
                    <hr className={styles.divider} />
                    
                    {/* Mengarah ke halaman pengaturan profil */}
                    <Link to="/profile" className={styles.dropdownItem}>
                      ⚙️ Pengaturan Profil
                    </Link>
                    
                    <button onClick={handleLogout} className={styles.dropdownLogoutBtn}>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <li><Link to="/login" className={styles.linkBtn}>Login</Link></li>
          )}
        </ul>

      </div>
    </nav>
  );
}