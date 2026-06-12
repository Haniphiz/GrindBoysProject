
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

import Home from "./components/pages/Home";
import Payment from "./components/pages/Payment/Payment";
import Hotel from "./components/pages/Hotel";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;