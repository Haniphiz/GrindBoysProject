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
import Profile from "./pages/profile/Profile"; // TAMBAHKAN INI

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES: Tanpa Navbar/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* LAYOUT ROUTES: Dengan Navbar & Footer */}
      <Route path="/" element={<Layout />}>
        {/* PUBlik */}
        <Route index element={<Home />} />
        <Route path="/hotel" element={<Hotel />} />
        
        {/* PROTECTED */}
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        
        {/* TAMBAHKAN ROUTE PROFILE DI SINI */}
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