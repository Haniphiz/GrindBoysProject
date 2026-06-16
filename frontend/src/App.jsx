import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import AdminLayout from "./components/Layout/AdminLayout";
// Protected Route
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// User Pages
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Payment from "./pages/payment/Payment";
import Profile from "./pages/profile/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoom from "./pages/admin/AdminRoom";
import AdminHotel from "./pages/admin/AdminHotel";

function App() {
  return (
    <Routes>

      {/* ========================= */}
      {/* PUBLIC ROUTES */}
      {/* ========================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ========================= */}
      {/* USER LAYOUT */}
      {/* ========================= */}

      <Route path="/" element={<Layout />}>

        {/* Home */}
        <Route index element={<Home />} />

        {/* Hotel */}
        <Route path="hotel" element={<Hotel />} />

        {/* Payment */}
        <Route
          path="payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ========================= */}
      {/* ADMIN LAYOUT */}
      {/* ========================= */}

  <Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<AdminDashboard />}
  />
<Route
  path="hotels"
  element={<AdminHotel />}
/>
  <Route
    path="rooms"
    element={<AdminRoom />}
  />
</Route>
    </Routes>
  );
}

export default App;