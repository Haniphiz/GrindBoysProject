import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div>
      <h1>Dashboard Admin</h1>

      <Link to="/admin/rooms">
        Kelola Kamar
      </Link>
    </div>
  );
}

export default AdminDashboard;