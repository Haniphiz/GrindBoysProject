import { Outlet } from "react-router-dom"; // WAJIB IMPORT INI
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        {/* GANTI children DENGAN Outlet */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}