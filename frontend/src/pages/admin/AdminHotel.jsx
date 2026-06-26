import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminHotel.module.css";

const API = "http://localhost:3000/api/hotels";
const FORMAT_DATE = (s) => {
  if (!s) return "-";
  return new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

function AdminHotel() {
  const [hotels, setHotels] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ nama: "", alamat: "", kota: "", deskripsi: "", gambar: null });
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get(API);
      setHotels(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, gambar: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append("name", formData.nama);
    data.append("address", formData.alamat);
    data.append("city", formData.kota);
    data.append("description", formData.deskripsi);
    if (formData.gambar) data.append("image", formData.gambar);
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      if (selectedId) {
        config.headers["Content-Type"] = "multipart/form-data";
        await axios.put(`${API}/${selectedId}`, data, config);
      } else {
        config.headers["Content-Type"] = "multipart/form-data";
        await axios.post(API, data, config);
      }
      reset();
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menyimpan hotel");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (hotel) => {
    setSelectedId(hotel.id);
    setFormData({ nama: hotel.name || "", alamat: hotel.address || "", kota: hotel.city || "", deskripsi: hotel.description || "", gambar: null });
    setPreview(hotel.image_url || null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus hotel ini?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      if (selectedId === id) reset();
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus hotel");
    }
  };

  const reset = () => {
    setSelectedId(null);
    setFormData({ nama: "", alamat: "", kota: "", deskripsi: "", gambar: null });
    setPreview(null);
    const fi = document.getElementById("hotelFileInput");
    if (fi) fi.value = "";
  };

  return (
    <div className={styles.page}>
      <p className={styles.eyebrow}>Manajemen Hotel</p>
      <h1 className={styles.title}>Kelola <span className={styles.accent}>Hotel</span></h1>
      <p className={styles.subtitle}>Tambah, edit, dan hapus data hotel properti Anda.</p>

      <div className={styles.grid}>
        {/* Form */}
        <div className={styles.formCard}>
          <div className={`${styles.formTag} ${selectedId ? styles.formTagEdit : styles.formTagNew}`}>
            {selectedId ? "✏️ Mengedit" : "✨ Baru"}
          </div>
          <h2 className={styles.formHeading}>{selectedId ? "Edit Hotel" : "Tambah Hotel"}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Nama Hotel</label>
                <input className={styles.input} name="nama" placeholder="Nama hotel" value={formData.nama} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Kota</label>
                <input className={styles.input} name="kota" placeholder="Kota" value={formData.kota} onChange={handleChange} required />
              </div>
              <div className={styles.fullCol}>
                <label className={styles.label}>Alamat</label>
                <input className={styles.input} name="alamat" placeholder="Alamat lengkap" value={formData.alamat} onChange={handleChange} required />
              </div>
              <div className={styles.fullCol}>
                <label className={styles.label}>Deskripsi</label>
                <textarea className={styles.textarea} name="deskripsi" placeholder="Fasilitas, layanan, dll." rows={3} value={formData.deskripsi} onChange={handleChange} required />
              </div>
              <div className={styles.fullCol}>
                <label className={styles.label}>Foto Hotel</label>
                <input id="hotelFileInput" type="file" accept="image/*" onChange={handleFile} className={styles.fileInput} />
                {preview && <img src={preview} alt="Preview" className={styles.preview} />}
              </div>
              <div className={styles.fullCol}>
                <div className={styles.btnRow}>
                  <button type="submit" disabled={submitting} className={`${styles.btn} ${styles.btnPrimary}`}>
                    {submitting ? "Menyimpan..." : selectedId ? "Simpan Perubahan" : "Tambah Hotel"}
                  </button>
                  {selectedId && (
                    <button type="button" onClick={reset} className={`${styles.btn} ${styles.btnGhost}`}>
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <div className={styles.tableTitle}>Daftar Hotel</div>
              <div className={styles.tableCount}>{hotels.length} properti terdaftar</div>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Gambar</th>
                  <th>Nama</th>
                  <th>Kota</th>
                  <th>Alamat</th>
                  <th>Deskripsi</th>
                  <th style={{ textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {hotels.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.tableEmpty}>
                      Belum ada data hotel. Tambahkan hotel baru melalui form di samping.
                    </td>
                  </tr>
                ) : (
                  hotels.map((hotel, i) => (
                    <tr key={hotel.id || i} className={styles.tableRow}>
                      <td>{i + 1}</td>
                      <td className={styles.imgCell}>
                        {hotel.image_url ? (
                          <img src={hotel.image_url} alt={hotel.name} className={styles.thumb}
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <span className={styles.noImg}>—</span>
                        )}
                      </td>
                      <td className={styles.nameCell}>{hotel.name}</td>
                      <td className={styles.metaCell}>{hotel.city}</td>
                      <td className={styles.truncate}>{hotel.address}</td>
                      <td className={styles.truncate}>{hotel.description}</td>
                      <td className={styles.actionCell}>
                        <button onClick={() => handleEdit(hotel)} className={`${styles.btnSm} ${styles.btnEdit}`}>Edit</button>
                        <button onClick={() => handleDelete(hotel.id)} className={`${styles.btnSm} ${styles.btnDelete}`}>Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHotel;
