import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, isLoaded } = useAuth();

  // Conditional Rendering: Tampilkan loading sampai state selesai cek localStorage (Slide 12)
  if (!isLoaded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }}>
        Memeriksa autentikasi...
      </div>
    );
  }

  // Jika tidak ada token, lempar ke halaman login (Slide 13)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, render halaman yang dilindungi
  return children;
};

export default ProtectedRoute;