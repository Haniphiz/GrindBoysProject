import { useEffect, useState } from "react";
import axios from "axios";

import RoomForm from "./RoomForm";
import RoomTable from "./RoomTable";

function AdminRoom() {

  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedRoom, setSelectedRoom] =
    useState(null);

  const loadRooms = async () => {

    const res = await axios.get(
      "http://localhost:3000/api/rooms"
    );

    setRooms(res.data.data);
  };

  const loadHotels = async () => {

    const res = await axios.get(
      "http://localhost:3000/api/hotels"
    );

    setHotels(res.data.data);
  };

  useEffect(() => {
    loadRooms();
    loadHotels();
  }, []);

  return (
    <div>

      <h1>Kelola Kamar</h1>

      <RoomForm
        hotels={hotels}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        onSuccess={loadRooms}
      />

      <hr />

      <RoomTable
        rooms={rooms}
        onRefresh={loadRooms}
        onEdit={setSelectedRoom}
      />

    </div>
  );
}

export default AdminRoom;