import { useState, useEffect } from "react";
import axios from "axios";

function HotelForm({
  onSuccess,
  selectedHotel,
  setSelectedHotel
}) {

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    description: ""
  });

  const [image, setImage] = useState(null);

  useEffect(() => {

    if (selectedHotel) {

      setFormData({
        name: selectedHotel.name || "",
        address: selectedHotel.address || "",
        city: selectedHotel.city || "",
        description:
          selectedHotel.description || ""
      });

    }

  }, [selectedHotel]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {

    setFormData({
      name: "",
      address: "",
      city: "",
      description: ""
    });

    setImage(null);

    if (setSelectedHotel) {
      setSelectedHotel(null);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token =
        localStorage.getItem("token");

      const data =
        new FormData();

      data.append(
        "name",
        formData.name
      );

      data.append(
        "address",
        formData.address
      );

      data.append(
        "city",
        formData.city
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

      if (selectedHotel) {

        await axios.put(
          `http://localhost:3000/api/hotels/${selectedHotel.id}`,
          data,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        alert(
          "Hotel berhasil diupdate"
        );

      } else {

        await axios.post(
          "http://localhost:3000/api/hotels",
          data,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        alert(
          "Hotel berhasil ditambahkan"
        );
      }

      resetForm();

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

      <h3>
        {selectedHotel
          ? "Edit Hotel"
          : "Tambah Hotel"}
      </h3>

      <input
        type="text"
        name="name"
        placeholder="Nama Hotel"
        value={formData.name}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="address"
        placeholder="Alamat"
        value={formData.address}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="city"
        placeholder="Kota"
        value={formData.city}
        onChange={handleChange}
      />

      <br /><br />

      <textarea
        name="description"
        placeholder="Deskripsi"
        value={formData.description}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="file"
        onChange={(e) =>
          setImage(
            e.target.files[0]
          )
        }
      />

      <br /><br />

      <button type="submit">

        {selectedHotel
          ? "Update Hotel"
          : "Tambah Hotel"}

      </button>

      {selectedHotel && (

        <button
          type="button"
          onClick={resetForm}
          style={{
            marginLeft: "10px"
          }}
        >
          Cancel
        </button>

      )}

    </form>
  );
}

export default HotelForm;