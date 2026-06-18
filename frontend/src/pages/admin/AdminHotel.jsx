import { useEffect, useState } from "react";
import axios from "axios";

function AdminHotel() {
  // ----------------------------------------------------
  // 1. STATE MANAGEMENT
  // ----------------------------------------------------
  const [hotels, setHotels] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    kota: "",
    deskripsi: "",
    gambar: null,
  });

  // ----------------------------------------------------
  // 2. API CALLS
  // ----------------------------------------------------
  const loadHotels = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/hotels");
      // Mengikuti struktur response res.data.data dari backend controller lu
      setHotels(res.data.data || res.data);
    } catch (error) {
      console.error("Gagal memuat data hotel:", error);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  // ----------------------------------------------------
  // 3. HANDLERS
  // ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, gambar: e.target.files[0] }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    dataToSend.append("name", formData.nama);
    dataToSend.append("address", formData.alamat);
    dataToSend.append("city", formData.kota);
    dataToSend.append("description", formData.deskripsi);
    
    if (formData.gambar) {
      dataToSend.append("image", formData.gambar);
    }

    try {
      // 1. Ambil token dari localStorage (Pastikan namanya sesuai dengan saat lu set pas login, misal "token")
      const token = localStorage.getItem("token"); 

      // 2. Bungkus konfigurasi headers, sertakan Authorization Bearer Token
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` // 🔥 Ini yang bikin lu dapet izin akses dari backend
        },
      };

      if (selectedId) {
        // 3. Kirim dengan config headers terbaru
        await axios.put(`http://localhost:3000/api/hotels/${selectedId}`, dataToSend, config);
        alert("Data hotel berhasil diperbarui!");
      } else {
        // 3. Kirim dengan config headers terbaru
        await axios.post("http://localhost:3000/api/hotels", dataToSend, config);
        alert("Hotel baru berhasil ditambahkan!");
      }
      handleReset();
      loadHotels();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      // Biar lebih detail kalau ada error lain nantinya:
      if (error.response) {
        console.log("Detail Error Backend:", error.response.data);
      }
      alert("Terjadi kendala saat menyimpan data.");
    }
  };

  const handleEdit = (hotel) => {
    setSelectedId(hotel.id);
    // FIX: Memetakan property database backend ke state form frontend
    setFormData({
      nama: hotel.name || "",
      alamat: hotel.address || "",
      kota: hotel.city || "",
      deskripsi: hotel.description || "",
      gambar: null, 
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data hotel ini?")) {
      try {
        await axios.delete(`http://localhost:3000/api/hotels/${id}`);
        alert("Hotel berhasil dihapus!");
        loadHotels();
        if (selectedId === id) handleReset();
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  const handleReset = () => {
    setSelectedId(null);
    setFormData({ nama: "", alamat: "", kota: "", deskripsi: "", gambar: null });
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  // ----------------------------------------------------
  // 4. RENDER UI
  // ----------------------------------------------------
  return (
    <div className="grindboys-content-only" style={{ width: "100%", padding: "10px" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .grindboys-content-only * { box-sizing: border-box; font-family: 'Segoe UI', system-ui, sans-serif; }
        .grindboys-card { background: #ffffff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin-bottom: 2rem; }
        .grindboys-card h3 { margin-bottom: 1.5rem; color: #1e293b; font-size: 1.3rem; font-weight: 700; }
        .grindboys-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; width: 100%; }
        .grindboys-full { grid-column: span 2; }
        .grindboys-form input[type="text"], 
        .grindboys-form textarea { width: 100%; padding: 0.8rem 1rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; color: #1e293b; outline: none; transition: 0.2s; }
        .grindboys-form input[type="text"]:focus, 
        .grindboys-form textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .grindboys-btn-primary { background-color: #2563eb; color: white; border: none; padding: 0.8rem 1.75rem; font-weight: 600; border-radius: 8px; cursor: pointer; transition: 0.2s; }
        .grindboys-btn-primary:hover { background-color: #1d4ed8; }
        .grindboys-btn-secondary { background-color: #64748b; color: white; border: none; padding: 0.8rem 1.75rem; font-weight: 600; border-radius: 8px; cursor: pointer; margin-left: 10px; }
        .grindboys-table-wrap { overflow-x: auto; width: 100%; margin-top: 1rem; }
        .grindboys-table { width: 100%; border-collapse: collapse; text-align: left; }
        .grindboys-table th { background-color: #f8fafc; color: #475569; font-weight: 700; padding: 1rem; border-bottom: 2px solid #e2e8f0; font-size: 0.9rem; }
        .grindboys-table td { padding: 1rem; border-bottom: 1px solid #e2e8f0; color: #1e293b; vertical-align: middle; }
        .grindboys-btn-edit { padding: 0.4rem 0.8rem; font-size: 0.85rem; border-radius: 6px; border: none; cursor: pointer; background-color: #e2e8f0; color: #1e293b; font-weight: 600; margin-right: 6px; }
        .grindboys-btn-delete { padding: 0.4rem 0.8rem; font-size: 0.85rem; border-radius: 6px; border: none; cursor: pointer; background-color: #ef4444; color: white; font-weight: 600; }
      `}} />

      {/* TAMPILAN FORM */}
      <div className="grindboys-card">
        <h3>{selectedId ? "📝 Edit Detail Hotel" : "✨ Tambah Hotel Baru"}</h3>
        <form onSubmit={handleSubmit} className="grindboys-form">
          <input
            type="text"
            name="nama"
            placeholder="Nama Hotel"
            value={formData.nama}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="kota"
            placeholder="Kabupaten / Kota"
            value={formData.kota}
            onChange={handleChange}
            required
          />
          <div className="grindboys-full">
            <input
              type="text"
              name="alamat"
              placeholder="Alamat Lengkap Hotel"
              value={formData.alamat}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grindboys-full">
            <textarea
              name="deskripsi"
              placeholder="Deskripsi Fasilitas & Layanan Hotel"
              rows="3"
              value={formData.deskripsi}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          
          <div className="grindboys-full" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>Upload Cover Gambar Hotel</label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="grindboys-full" style={{ marginTop: "10px" }}>
            <button type="submit" className="grindboys-btn-primary">
              {selectedId ? "Simpan Perubahan" : "Simpan Data"}
            </button>
            {selectedId && (
              <button type="button" onClick={handleReset} className="grindboys-btn-secondary">
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TAMPILAN TABEL */}
      <div className="grindboys-card">
        <h3>📋 Record Database Hotel</h3>
        <div className="grindboys-table-wrap">
          <table className="grindboys-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>No</th>
                <th>Visual</th>
                <th>Nama Tempat</th>
                <th>Lokasi Kota</th>
                <th>Alamat</th>
                <th>Deskripsi</th>
                <th style={{ textAlign: "center", width: "160px" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {hotels.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", color: "#94a3b8" }}>Database kosong atau backend terputus.</td>
                </tr>
              ) : (
                hotels.map((hotel, index) => (
                  <tr key={hotel.id || index}>
                    <td>{index + 1}</td>
                    <td>
                      {/* FIX: Menggunakan hotel.image_url hasil olahan backend controller */}
                      {hotel.image_url ? (
                        <img
                          src={hotel.image_url}
                          alt={hotel.name}
                          style={{ width: "65px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                          onError={(e) => { e.target.src = "https://placehold.co/65x40?text=No+Img"; }}
                        />
                      ) : (
                        <span style={{ fontSize: "0.80rem", color: "#94a3b8" }}>Kosong</span>
                      )}
                    </td>
                    {/* FIX: Field disesuaikan dengan key dari database (name, city, address, description) */}
                    <td style={{ fontWeight: "600" }}>{hotel.name}</td>
                    <td>{hotel.city}</td>
                    <td>{hotel.address}</td>
                    <td style={{ maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {hotel.description}
                    </td>
                    <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      <button className="grindboys-btn-edit" onClick={() => handleEdit(hotel)}>Edit</button>
                      <button className="grindboys-btn-delete" onClick={() => handleDelete(hotel.id)}>Hapus</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AdminHotel;