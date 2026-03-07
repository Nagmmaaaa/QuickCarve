import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function getAccessToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access") ||
    sessionStorage.getItem("accessToken") ||
    null
  );
}

function getAdminAccessToken() {
  return localStorage.getItem("admin_access") || null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = getAdminAccessToken();
    const userToken = getAccessToken();
    
    if (adminToken) {
      const username = localStorage.getItem("admin_username") || "Admin";
      setUser({ username, is_staff: true });
    } else if (userToken) {
      const username = localStorage.getItem("username");
      const isStaff = localStorage.getItem("is_staff") === "true";
      if (username) {
        setUser({ username, is_staff: isStaff });
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("username", userData.username);
    if (userData.is_staff) {
      localStorage.setItem("is_staff", "true");
    } else {
      localStorage.removeItem("is_staff");
    }
    setUser(userData);
  };

  const logout = () => {
    const isAdmin = !!localStorage.getItem("admin_access");
    
    if (isAdmin) {
      localStorage.removeItem("admin_access");
      localStorage.removeItem("admin_refresh");
      localStorage.removeItem("admin_username");
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");
      localStorage.removeItem("is_staff");
    }
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);