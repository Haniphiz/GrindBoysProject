import React, { useState } from "react";

function HotelForm() {
  const [form, setForm] = useState({ name: "", address: "", city: "" });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch("http://localhost:5000/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => alert(data.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nama Hotel" onChange={handleChange} />
      <input name="address" placeholder="Alamat" onChange={handleChange} />
      <input name="city" placeholder="Kota" onChange={handleChange} />
      <button type="submit">Tambah Hotel</button>
    </form>
  );
}

export default HotelForm;
