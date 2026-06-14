import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// TAMBAHKAN INI: Import AuthContext (Slide 13: Global State)
import { AuthProvider } from "./context/AuthContext"; 

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* TAMBAHKAN INI: Bungkus App dengan AuthProvider */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);