import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Register.module.css";

export default function Register() {
    const navigate = useNavigate();

    // Controlled Component (Slide 12) - Sesuai dengan kebutuhan backend (username, email, password)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validasi Frontend: Password cocok
        if (formData.password !== formData.confirmPassword) {
            return setError("Password dan Konfirmasi Password tidak cocok");
        }

        // Validasi Frontend: Panjang password
        if (formData.password.length < 6) {
            return setError("Password minimal 6 karakter");
        }

        setIsLoading(true);

        try {
            // Fetch API (Slide 10) - Menghubungkan ke Database via Backend
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // JIKA DATABASE KAMU PAKAI KOLOM "name", GANTI "username" JADI "name"
                    // name: formData.username, 
                    username: formData.username, // Coba ini dulu
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registrasi gagal");
            }

            // Jika sukses, arahkan ke halaman Login
            alert("Registrasi berhasil! Silakan login.");
            navigate("/login");

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                <div className={styles.header}>
                    <h2>Buat Akun Baru</h2>
                    <p>Isi data diri Anda untuk bergabung dengan GrindBoys</p>
                </div>

                {/* Conditional Rendering: Error (Slide 12) */}
                {error && (
                    <div className={styles.errorBox}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>

                    <div className={styles.inputGroup}>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Masukkan username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="contoh@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Minimal 6 karakter"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Konfirmasi Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Ulangi password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className={styles.btnRegister} disabled={isLoading}>
                        {isLoading ? "Memproses..." : "Daftar Sekarang"}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Sudah punya akun?
                        <Link to="/login"> Masuk di sini</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}