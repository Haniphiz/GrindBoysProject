import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={navbarStyles.navbar}>
      <h2 style={navbarStyles.logo}>HotelBooking</h2>
<ul style={navbarStyles.navLinks}>
  <li>
    <Link to="/" style={navbarStyles.link}>
      Home
    </Link>
  </li>

  <li>
    <Link to="/hotel" style={navbarStyles.link}>
      Hotel
    </Link>
  </li>

  <li>
    <Link to="/booking" style={navbarStyles.link}>
      Booking
    </Link>
  </li>

  <li>
    <Link to="/login" style={navbarStyles.link}>
      Login
    </Link>
  </li>
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