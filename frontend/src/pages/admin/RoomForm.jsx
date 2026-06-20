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

  const handleCancel = () => {

    setSelectedRoom(null);

    setFormData({
      hotel_id: "",
      room_type: "",
      price: "",
      capacity: "",
      description: ""
    });

    setImage(null);

  };

  return (
    <form className="room-form" onSubmit={handleSubmit}>

      <span
        className={
          selectedRoom
            ? "room-form__tag room-form__tag--edit"
            : "room-form__tag room-form__tag--new"
        }
      >
        {selectedRoom ? "Mengedit" : "Entri Baru"}
      </span>

      <h2 className="room-form__heading">
        {selectedRoom ? "Perbarui Kamar" : "Tambah Kamar"}
      </h2>

      <div className="room-form__field">
        <label className="room-form__label">Hotel</label>
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
      </div>

      <div className="room-form__field">
        <label className="room-form__label">Tipe Kamar</label>
        <input
          type="text"
          name="room_type"
          placeholder="cth. Deluxe Twin"
          value={formData.room_type}
          onChange={handleChange}
        />
      </div>

      <div className="room-form__row">
        <div className="room-form__field">
          <label className="room-form__label">Harga / malam</label>
          <input
            type="number"
            name="price"
            placeholder="450000"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="room-form__field">
          <label className="room-form__label">Kapasitas</label>
          <input
            type="number"
            name="capacity"
            placeholder="2"
            value={formData.capacity}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="room-form__field">
        <label className="room-form__label">Deskripsi</label>
        <textarea
          name="description"
          placeholder="Fasilitas, pemandangan, catatan lain..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="room-form__field">
        <label className="room-form__label">Foto Kamar</label>
        <div className="room-form__file">
          <input
            type="file"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
          />
        </div>
      </div>

      <div className="room-form__actions">
        <button type="submit" className="btn btn--primary">
          {selectedRoom
            ? "Update Kamar"
            : "Tambah Kamar"}
        </button>

        {selectedRoom && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleCancel}
          >
            Batal
          </button>
        )}
      </div>

    </form>
  );
}

export default RoomForm;
