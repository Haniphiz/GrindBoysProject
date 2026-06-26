import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 menit
const CHECK_INTERVAL = 30 * 1000; // cek setiap 30 detik

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update timestamp aktivitas terakhir
  const updateActivity = useCallback(() => {
    if (token) {
      localStorage.setItem("lastActivity", Date.now());
    }
  }, [token]);

  // Cek apakah sesi expired karena inactivity
  const checkInactivity = useCallback(() => {
    const lastActive = localStorage.getItem("lastActivity");
    if (lastActive && Date.now() - Number(lastActive) > INACTIVITY_TIMEOUT) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lastActivity");
      setToken(null);
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      // Cek inactivity sebelum restore sesi
      const lastActive = localStorage.getItem("lastActivity");
      if (lastActive && Date.now() - Number(lastActive) > INACTIVITY_TIMEOUT) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastActivity");
        setIsLoaded(true);
        return;
      }

      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      updateActivity();
    }

    setIsLoaded(true);
  }, [updateActivity]);

  // Listener aktivitas pengguna (sliding window)
  useEffect(() => {
    if (!token) return;

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, updateActivity));

    // Periodic check
    const interval = setInterval(checkInactivity, CHECK_INTERVAL);

    return () => {
      events.forEach((e) => window.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, [token, updateActivity, checkInactivity]);

  const login = (tokenData, userData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("lastActivity", Date.now());
    setToken(tokenData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
    setToken(null);
    setUser(null);
  };

  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoaded, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};