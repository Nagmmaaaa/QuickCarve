import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function getRestaurantAccessToken() {
  const t = localStorage.getItem("restaurant_access");
  if (!t) return null;
  const s = String(t).trim();
  if (!s || s === "null" || s === "undefined") return null;
  return s;
}

export default function RestaurantProtectedRoute({ children }) {
  const location = useLocation();
  const token = getRestaurantAccessToken();
  
  if (!token) {
    return <Navigate to="/restaurant/login" replace state={{ from: location }} />;
  }
  
  return children;
}