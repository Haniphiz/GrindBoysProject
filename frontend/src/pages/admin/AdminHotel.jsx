import { useEffect, useState } from "react";
import axios from "axios";

import HotelForm from "./HotelForm";
import HotelTable from "./HotelTable";

function AdminHotel() {

  const [hotels, setHotels] =
    useState([]);

  const [selectedHotel,
    setSelectedHotel] =
    useState(null);

  const loadHotels = async () => {

    const res =
      await axios.get(
        "http://localhost:3000/api/hotels"
      );

    setHotels(res.data.data);
  };

  useEffect(() => {
    loadHotels();
  }, []);

  return (
    <div>

      <h1>Kelola Hotel</h1>

      <HotelForm
        onSuccess={loadHotels}
        selectedHotel={selectedHotel}
        setSelectedHotel={
          setSelectedHotel
        }
      />

      <hr />

      <HotelTable
        hotels={hotels}
        onRefresh={loadHotels}
        onEdit={setSelectedHotel}
      />

    </div>
  );
}

export default AdminHotel;