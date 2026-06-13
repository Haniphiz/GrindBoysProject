import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ PORT SUDAH DIUBAH KE 3000 SAKTI
      const response = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username, email })
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        updateUser({ username, email });
        setMessage({ type: "success", text: data.message || "Profil berhasil diperbarui!" });
      } else {
        setMessage({ type: "error", text: data.message || "Gagal memperbarui profil." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi server." });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage({ type: "error", text: "Konfirmasi password baru tidak cocok!" });
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ PORT SUDAH DIUBAH KE 3000 SAKTI
      const response = await fetch("http://localhost:3000/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setMessage({ type: "success", text: data.message || "Password berhasil diganti!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.message || "Gagal mengganti password." });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileCard}>
        <h2 className={styles.title}>⚙️ Pengaturan Profil</h2>
        
        {message.text && (
          <div className={`${styles.alert} ${message.type === "success" ? styles.alertSuccess : styles.alertError}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className={styles.formSection}>
          <h3>Informasi Pengguna</h3>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        <hr className={styles.divider} />

        <form onSubmit={handleChangePassword} className={styles.formSection}>
          <h3>Keamanan & Kata Sandi</h3>
          <div className={styles.inputGroup}>
            <label>Password Lama</label>
            <input 
              type="password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password Baru</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Konfirmasi Password Baru</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={styles.passwordBtn} disabled={loading}>
            {loading ? "Memproses..." : "Perbarui Kata Sandi"}
          </button>
        </form>
      </div>
    </div>
  );
}