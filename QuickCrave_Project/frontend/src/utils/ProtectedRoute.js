// src/utils/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getAccessToken() {
  const t =
    localStorage.getItem("access") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access") ||
    sessionStorage.getItem("accessToken");
  if (!t) return null;
  const s = String(t).trim();
  if (!s || s === "null" || s === "undefined") return null;
  return s;
}

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getAccessToken();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}