import React, { useEffect, useState } from "react";

function HotelList() {
  const [hotels, setHotels] = useState([]);

  // READ: ambil data hotel dari backend
  useEffect(() => {
    fetch("http://localhost:5000/api/hotels")
      .then(res => res.json())
      .then(data => setHotels(data.data));
  }, []);

  // DELETE: hapus hotel
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/hotels/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => {
        setHotels(hotels.filter(hotel => hotel.id !== id));
      });
  };

  // UPDATE: ubah nama hotel
  const handleUpdate = (id) => {
    const newName = prompt("Masukkan nama baru:");
    if (!newName) return;

    fetch(`http://localhost:5000/api/hotels/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    })
      .then(res => res.json())
      .then(() => {
        setHotels(hotels.map(hotel =>
          hotel.id === id ? { ...hotel, name: newName } : hotel
        ));
      });
  };

  return (
    <div>
      <h2>Daftar Hotel</h2>
      <ul>
        {hotels.map(hotel => (
          <li key={hotel.id}>
            {hotel.name} - {hotel.city}
            <button onClick={() => handleUpdate(hotel.id)}>Edit</button>
            <button onClick={() => handleDelete(hotel.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HotelList;
