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
    <div
      style={{
        overflowX: "auto",
        marginTop: "20px"
      }}
    >
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
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
              <td
                colSpan="8"
                style={{
                  textAlign: "center"
                }}
              >
                Tidak ada data kamar
              </td>
            </tr>
          ) : (

            rooms.map((room) => {

              console.log(
                "ROOM IMAGE:",
                room.image_url
              );

              return (
                <tr key={room.id}>

                  <td>{room.id}</td>

                  <td>

                    {room.image_url ? (

                      <img
                        src={room.image_url}
                        alt={room.room_type}
                        width="100"
                        height="70"
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px"
                        }}
                        onError={(e) => {
                          console.log(
                            "Gagal load gambar:",
                            room.image_url
                          );

                          e.target.src =
                            "https://via.placeholder.com/100x70?text=No+Image";
                        }}
                      />

                    ) : (

                      <img
                        src="https://via.placeholder.com/100x70?text=No+Image"
                        alt="No Image"
                        width="100"
                        height="70"
                      />

                    )}

                  </td>

                  <td>
                    {room.hotel_name}
                  </td>

                  <td>
                    {room.room_type}
                  </td>

                  <td>
                    Rp{" "}
                    {Number(
                      room.price
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </td>

                  <td>
                    {room.capacity}
                    {" "}Orang
                  </td>

                  <td>
                    {room.description ||
                      "-"}
                  </td>

                  <td>

                    <button
  onClick={() => onEdit(room)}
>
  Edit
</button>

                    <button
                      onClick={() =>
                        handleDelete(
                          room.id
                        )
                      }
                    >
                      Hapus
                    </button>

                  </td>

                </tr>
              );
            })

          )}

        </tbody>
      </table>
    </div>
  );
}

export default RoomTable;