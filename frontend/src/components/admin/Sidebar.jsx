import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2>Admin Panel</h2>

      <ul>

        <li>
          <Link to="/admin">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/admin/rooms">
            Kelola Kamar
          </Link>
        </li>

        <li>
          <Link to="/admin/hotels">
            Kelola Hotel
          </Link>
        </li>

        <li>
          <Link to="/admin/bookings">
            Booking
          </Link>
        </li>

        <li>
          <Link to="/admin/reviews">
            Review
          </Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;