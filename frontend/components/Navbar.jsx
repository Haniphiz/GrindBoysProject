function Navbar() {
  return (
    <nav style={navbarStyles.navbar}>
      <h2 style={navbarStyles.logo}>HotelBooking</h2>

      <ul style={navbarStyles.navLinks}>
        <li><a href="/" style={navbarStyles.link}>Home</a></li>
        <li><a href="/hotel" style={navbarStyles.link}>Hotel</a></li>
        <li><a href="/booking" style={navbarStyles.link}>Booking</a></li>
        <li><a href="/login" style={navbarStyles.link}>Login</a></li>
      </ul>
    </nav>
  );
}

const navbarStyles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#3f45b5",
    padding: "20px 40px",
  },
  logo: {
    color: "white",
    margin: 0,
  },
  navLinks: {
    display: "flex",
    gap: "25px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Navbar;