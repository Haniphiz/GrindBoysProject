import axios from "axios";

function RoomTable({
  rooms,
  onRefresh,
  onEdit
}) {

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Yakin ingin menghapus kamar ini?"
    );

    if (!confirmDelete) return;

    try {

      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://localhost:3000/api/rooms/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Kamar berhasil dihapus");

      onRefresh();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Gagal menghapus kamar"
      );
    }
  };

  return (
    <div className="room-table-wrap">
      <div className="room-table-wrap__scroll">
        <table className="room-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Gambar</th>
              <th>Hotel</th>
              <th>Tipe</th>
              <th>Harga</th>
              <th>Kapasitas</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>

            {rooms.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="room-table__empty">
                    <p className="room-table__empty-title">
                      Belum ada kamar
                    </p>
                    <p>
                      Tambahkan kamar pertama lewat formulir di samping.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (

              rooms.map((room) => (

                <tr key={room.id}>

                  <td className="room-table__id">
                    #{room.id}
                  </td>

                  <td>

                    {room.image_url ? (

                      <img
                        className="room-table__thumb"
                        src={room.image_url}
                        alt={room.room_type}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='70'%3E%3Crect width='100' height='70' fill='%23E6DFCD'/%3E%3Ctext x='50' y='38' font-size='10' fill='%2374808F' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />

                    ) : (

                      <div
                        className="room-table__thumb"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--line)",
                          color: "var(--slate)",
                          fontSize: "10px"
                        }}
                      >
                        No Image
                      </div>

                    )}

                  </td>

                  <td className="room-table__hotel">
                    {room.hotel_name}
                  </td>

                  <td className="room-table__type">
                    {room.room_type}
                  </td>

                  <td className="room-table__price">
                    Rp{" "}
                    {Number(
                      room.price
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    <span className="room-table__pill">
                      {room.capacity} Orang
                    </span>
                  </td>

                  <td className="room-table__desc" title={room.description || "-"}>
                    {room.description || "-"}
                  </td>

                  <td>
                    <div className="room-table__actions">
                      <button
                        className="btn btn--icon btn--edit"
                        onClick={() => onEdit(room)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn--icon btn--delete"
                        onClick={() =>
                          handleDelete(
                            room.id
                          )
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  </td>

                </tr>
              ))

            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RoomTable;
