import axios from "axios";

function HotelTable({
  hotels,
  onRefresh,
  onEdit
}) {

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Yakin hapus hotel?"
        );

      if (!confirmDelete)
        return;

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.delete(
          `http://localhost:3000/api/hotels/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

        alert(
          "Hotel berhasil dihapus"
        );

        onRefresh();

      } catch (err) {

        console.log(err);

        alert(
          err.response?.data?.message ||
          "Gagal menghapus hotel"
        );
      }
    };

  return (

    <table
      border="1"
      cellPadding="10"
      style={{
        width: "100%",
        marginTop: "20px"
      }}
    >

      <thead>

        <tr>
          <th>ID</th>
          <th>Gambar</th>
          <th>Nama</th>
          <th>Kota</th>
          <th>Alamat</th>
          <th>Deskripsi</th>
          <th>Aksi</th>
        </tr>

      </thead>

      <tbody>

        {hotels.map(
          (hotel) => (

            <tr key={hotel.id}>

              <td>
                {hotel.id}
              </td>

              <td>

                {hotel.image_url ? (

                  <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    width="120"
                  />

                ) : (
                  "-"
                )}

              </td>

              <td>
                {hotel.name}
              </td>

              <td>
                {hotel.city}
              </td>

              <td>
                {hotel.address}
              </td>

              <td>
                {hotel.description}
              </td>

              <td>

                <button
                  onClick={() =>
                    onEdit(hotel)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      hotel.id
                    )
                  }
                  style={{
                    marginLeft:
                      "10px"
                  }}
                >
                  Hapus
                </button>

              </td>

            </tr>

          )
        )}

      </tbody>

    </table>
  );
}

export default HotelTable;