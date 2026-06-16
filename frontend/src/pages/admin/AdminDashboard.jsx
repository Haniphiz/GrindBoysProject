import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {

    const loadStats =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await axios.get(
              "http://localhost:3000/api/admin/dashboard",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          setStats(
            res.data.data
          );

        } catch (err) {

          console.log(err);
        }
      };

    loadStats();

  }, []);

  if (!stats)
    return <h2>Loading...</h2>;

  return (
    <div>

      <h1>
        Dashboard Admin
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: "20px",
          marginTop: "30px"
        }}
      >

        <Card
          title="Total Hotel"
          value={stats.totalHotels}
        />

        <Card
          title="Total Room"
          value={stats.totalRooms}
        />

        <Card
          title="Total Booking"
          value={stats.totalBookings}
        />

        <Card
          title="Total User"
          value={stats.totalUsers}
        />

      </div>

    </div>
  );
}

function Card({
  title,
  value
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,.1)"
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

export default AdminDashboard;