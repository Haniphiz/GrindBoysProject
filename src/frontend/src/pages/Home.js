import React from "react";
import HotelForm from "../components/HotelForm";
import HotelList from "../components/HotelList";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Hotel Booking System</h1>
      <HotelForm />
      <HotelList />
    </div>
  );
}

export default Home;
