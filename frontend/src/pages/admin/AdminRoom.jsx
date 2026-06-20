import { useEffect, useState } from "react";
import axios from "axios";

import RoomForm from "./RoomForm";
import RoomTable from "./RoomTable";
import "./AdminRoom.css";

function AdminRoom() {

  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const loadRooms = async () => {
    const res = await axios.get("http://localhost:3000/api/rooms");
    setRooms(res.data.data);
  };

  const loadHotels = async () => {
    const res = await axios.get("http://localhost:3000/api/hotels");
    setHotels(res.data.data);
  };

  useEffect(() => {
    loadRooms();
    loadHotels();
  }, []);

  return (
    <div className="room-admin">

      <div className="room-admin__header">
        <div>
          <p className="room-admin__eyebrow">Panel Admin</p>
          <h1 className="room-admin__title">Kelola Kamar</h1>
        </div>
        <div className="room-admin__count">
          Total kamar<br />
          <b>{rooms.length}</b>
        </div>
      </div>

      <div className="room-admin__grid">

        <RoomForm
          hotels={hotels}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          onSuccess={loadRooms}
        />

        <RoomTable
          rooms={rooms}
          onRefresh={loadRooms}
          onEdit={setSelectedRoom}
        />

      </div>
    </div>
  );
}

export default AdminRoom;
