import { useState, useEffect } from "react";
import axios from "axios";

function RoomForm({
  hotels,
  onSuccess,
  selectedRoom,
  setSelectedRoom
}) {

  const [formData, setFormData] =
    useState({
      hotel_id: "",
      room_type: "",
      price: "",
      capacity: "",
      description: ""
    });

  const [image, setImage] =
    useState(null);

  useEffect(() => {

    if (selectedRoom) {

      setFormData({
        hotel_id:
          selectedRoom.hotel_id,
        room_type:
          selectedRoom.room_type,
        price:
          selectedRoom.price,
        capacity:
          selectedRoom.capacity,
        description:
          selectedRoom.description || ""
      });

    }

  }, [selectedRoom]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const data =
          new FormData();

        data.append(
          "hotel_id",
          formData.hotel_id
        );

        data.append(
          "room_type",
          formData.room_type
        );

        data.append(
          "price",
          formData.price
        );

        data.append(
          "capacity",
          formData.capacity
        );

        data.append(
          "description",
          formData.description
        );

        if (image) {

          data.append(
            "image",
            image
          );

        }

        if (selectedRoom) {

          await axios.put(
            `http://localhost:3000/api/rooms/${selectedRoom.id}`,
            data,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

          alert(
            "Kamar berhasil diupdate"
          );

        } else {

          await axios.post(
            "http://localhost:3000/api/rooms",
            data,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

          alert(
            "Kamar berhasil ditambahkan"
          );
        }

        setFormData({
          hotel_id: "",
          room_type: "",
          price: "",
          capacity: "",
          description: ""
        });

        setImage(null);

        setSelectedRoom(null);

        onSuccess();

      } catch (err) {

        console.error(err);

        alert(
          err.response?.data?.message ||
          "Terjadi kesalahan"
        );

      }

    };

  return (
    <form onSubmit={handleSubmit}>

      <select
        name="hotel_id"
        value={formData.hotel_id}
        onChange={handleChange}
      >
        <option value="">
          Pilih Hotel
        </option>

        {hotels.map((hotel) => (

          <option
            key={hotel.id}
            value={hotel.id}
          >
            {hotel.name}
          </option>

        ))}
      </select>

      <input
        type="text"
        name="room_type"
        placeholder="Tipe Kamar"
        value={formData.room_type}
        onChange={handleChange}
      />

      <input
        type="number"
        name="price"
        placeholder="Harga"
        value={formData.price}
        onChange={handleChange}
      />

      <input
        type="number"
        name="capacity"
        placeholder="Kapasitas"
        value={formData.capacity}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Deskripsi"
        value={formData.description}
        onChange={handleChange}
      />

      <input
        type="file"
        onChange={(e) =>
          setImage(
            e.target.files[0]
          )
        }
      />

      <button type="submit">

        {selectedRoom
          ? "Update Kamar"
          : "Tambah Kamar"}

      </button>

      {selectedRoom && (

        <button
          type="button"
          onClick={() => {

            setSelectedRoom(null);

            setFormData({
              hotel_id: "",
              room_type: "",
              price: "",
              capacity: "",
              description: ""
            });

            setImage(null);

          }}
        >
          Cancel
        </button>

      )}

    </form>
  );
}

export default RoomForm;