import { Routes, Route } from "react-router-dom";

// Komponen Reusable
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// Halaman
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Payment from "./pages/payment/Payment";
import Profile from "./pages/profile/Profile";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import Booking from "./pages/booking/Booking";

function App() {
  return (
    <Routes>
      {/* ═══ PUBLIC: Tanpa Layout ═══ */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ═══ DENGAN LAYOUT (Navbar + Footer) ═══ */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/booking" element={<Booking />} />

        {/* ═══ PROTECTED: Butuh Login ═══ */}
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;