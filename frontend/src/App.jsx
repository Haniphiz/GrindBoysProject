import Navbar from "../components/Navbar"; // Pastikan path import sudah sesuai dengan struktur foldermu
import Footer from "../components/Footer";

function App() {
  return (
    <>
      <Navbar />
      
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "50px", marginBottom: "20px", lineHeight: "1.3" }}>
          Selamat Datang di Web Pemesanan<br />Tiket Hotel
        </h1>

        <p style={{ fontSize: "20px", color: "gray", marginTop: "10px" }}>
          Pesan hotel dengan mudah dan cepat.
        </p>
      </div>

      <Footer />
    </>
  );
}

export default App;