import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Icons = {
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  hotel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V7l9-4 9 4v14"/><path d="M9 21V11h6v10"/><line x1="7" y1="13" x2="7.01" y2="13"/><line x1="17" y1="13" x2="17.01" y2="13"/><line x1="7" y1="17" x2="7.01" y2="17"/><line x1="17" y1="17" x2="17.01" y2="17"/></svg>,
  room: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V3h18v18"/><path d="M15 21v-6H9v6"/><line x1="7" y1="7" x2="7.01" y2="7"/><line x1="12" y1="7" x2="12.01" y2="7"/><line x1="17" y1="7" x2="17.01" y2="7"/><line x1="7" y1="11" x2="7.01" y2="11"/><line x1="12" y1="11" x2="12.01" y2="11"/><line x1="17" y1="11" x2="17.01" y2="11"/></svg>,
  booking: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/><line x1="8" y1="18" x2="8.01" y2="18"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const navItems = [
  { path: "/admin", label: "Dashboard", icon: Icons.dashboard, exact: true },
  { path: "/admin/hotels", label: "Hotel", icon: Icons.hotel },
  { path: "/admin/rooms", label: "Kamar", icon: Icons.room },
  { path: "/admin/bookings", label: "Booking", icon: Icons.booking },
];

function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const getInitial = (name) => (name || "").charAt(0).toUpperCase();

  return (
    <>
      <div className={`sidebarOverlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brandIcon">🏨</div>
          <div className="brandText">
            <span className="brandName">HotelBooking</span>
            <span className="brandSub">Admin Panel</span>
          </div>
        </div>

        <div className="navSection">Menu Utama</div>
        <ul className="navList">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`navLink ${isActive(item) ? "active" : ""}`}
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="userArea">
          <div className="userInfo">
            <div className="userAvatar">{getInitial(user?.username)}</div>
            <div>
              <div className="userName">{user?.username || "Admin"}</div>
              <div className="userRole">{user?.role === "super_admin" ? "Super Admin" : "Admin"}</div>
            </div>
          </div>
          <button className="logoutBtn" onClick={handleLogout}>
            {Icons.logout}
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
