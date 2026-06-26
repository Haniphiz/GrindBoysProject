import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../admin/Sidebar";
import styles from "./AdminLayout.module.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={styles.content}>
        <div className={styles.mobileHeader}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div>
            <div className={styles.headerTitle}>HotelBooking</div>
            <div className={styles.headerSub}>Admin Panel</div>
          </div>
        </div>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
