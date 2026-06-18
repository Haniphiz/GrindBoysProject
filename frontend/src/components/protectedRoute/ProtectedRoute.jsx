import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, role }) => {
  const { token, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const decoded = jwtDecode(token);
    
    // PERBAIKAN: Biar bisa menerima teks ("admin") maupun array (["admin", "super_admin"])
    const allowedRoles = Array.isArray(role) ? role : [role];

    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;