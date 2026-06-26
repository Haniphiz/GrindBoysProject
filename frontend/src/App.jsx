import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// User Pages
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Payment from "./pages/payment/Payment";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import Profile from "./pages/profile/Profile";
import Booking from "./pages/booking/Booking"; 

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoom from "./pages/admin/AdminRoom";
import AdminHotel from "./pages/admin/AdminHotel";
import AdminBooking from "./pages/admin/AdminBooking";

function App() {
  return (
    <Routes>
      {/* ========================= */}
      {/* PUBLIC ROUTES */}
      {/* ========================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      {/* ========================= */}
      {/* USER LAYOUT */}
      {/* ========================= */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="hotel" element={<Hotel />} />
        <Route path="booking" element={<Booking />} />
        <Route path="payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      {/* ========================= */}
      {/* ADMIN LAYOUT */}
      {/* ========================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role={["admin", "super_admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="hotels" element={<AdminHotel />} />
        <Route path="rooms" element={<AdminRoom />} />
        <Route path="bookings" element={<AdminBooking />} /> 
      </Route>
    </Routes>
  );
}

export default App;