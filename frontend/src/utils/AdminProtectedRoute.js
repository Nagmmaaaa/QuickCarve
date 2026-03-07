import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getAdminAccessToken() {
  const t = localStorage.getItem("admin_access");
  if (!t) return null;
  const s = String(t).trim();
  if (!s || s === "null" || s === "undefined") return null;
  return s;
}

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const token = getAdminAccessToken();
  
  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  
  return children;
}