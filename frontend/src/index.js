// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { DarkModeProvider } from "./context/DarkModeContext"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <DarkModeProvider> {/* ✅ wrap your app here */}
          <App />
        </DarkModeProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
