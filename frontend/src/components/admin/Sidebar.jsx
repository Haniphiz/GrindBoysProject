import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">

      <div>
        <h2>Admin Panel</h2>

        <ul>
          <li>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/rooms">Kelola Kamar</Link>
          </li>
          <li>
            <Link to="/admin/hotels">Kelola Hotel</Link>
          </li>
          <li>
            <Link to="/admin/bookings">Booking</Link>
          </li>
          <li>
            <Link to="/admin/reviews">Review</Link>
          </li>
        </ul>
      </div>

      {/* Tombol logout sekarang memanggil class dari CSS */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
}

export default Sidebar;