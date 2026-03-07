// src/context/CartContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/http";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const toNum = (v) =>
  v === null || v === undefined || v === "" || Number.isNaN(Number(v))
    ? null
    : Number(v);

// Normalize API response to a consistent UI shape
const normalizeCart = (data) => {
  const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  return list
    .map((ci, idx) => {
      const mid =
        ci.menu_item_id ??
        ci.menu_item?.id ??
        ci.product_id ??
        ci.item_id ??
        ci.menuItemId ??
        ci.menu_itemId ??
        null;

      const rid =
        ci.restaurant_id ??
        ci.restaurant ??
        ci.menu_item?.restaurant_id ??
        null;

      const name = ci.name ?? ci.item_name ?? ci.menu_item?.name ?? "Item";
      const price = Number(ci.price ?? ci.item_price ?? ci.menu_item?.price ?? 0) || 0;

      return {
        id: toNum(mid),                              // menu item id (may be null)
        lineId: toNum(ci.id ?? ci.cart_item_id) ?? idx, // unique cart line id
        name,
        price,
        image: ci.image ?? ci.menu_item?.item_image_url ?? "",
        quantity: ci.quantity ?? 1,
        restaurant_id: toNum(rid),
      };
    })
    .filter((x) => x.lineId !== null); // we must have a lineId
};

// Discover what POST /cart/ expects
const getCartPostSchema = async () => {
  try {
    const res = await api.options("/cart/");
    return res.data?.actions?.POST || {};
  } catch {
    return {};
  }
};

// Build a payload matching server schema (for create)
const buildCreatePayload = (schema, item, qty = 1) => {
  const id = toNum(item.id ?? item.menu_item_id);
  const rest = toNum(item.restaurant_id ?? item.restaurant);

  if (schema.menu_item_id !== undefined) {
    const p = { menu_item_id: id, quantity: qty };
    if (schema.restaurant !== undefined && rest !== null) p.restaurant = rest;
    return p;
  }
  if (schema.menu_item !== undefined) {
    const p = { menu_item: id, quantity: qty };
    if (schema.restaurant !== undefined && rest !== null) p.restaurant = rest;
    return p;
  }
  if (schema.item_id !== undefined) {
    const p = { item_id: id, quantity: qty };
    if (schema.restaurant !== undefined && rest !== null) p.restaurant = rest;
    return p;
  }
  if (schema.product_id !== undefined) {
    const p = { product_id: id, quantity: qty };
    if (schema.restaurant !== undefined && rest !== null) p.restaurant = rest;
    return p;
  }
  // Legacy fallback (rare)
  const legacy = {
    item_name: item.name,
    item_price: item.price,
    quantity: qty,
  };
  if (schema.restaurant !== undefined && rest !== null) legacy.restaurant = rest;
  return legacy;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Check if user has token
  const loggedIn = !!(
    localStorage.getItem("access") || localStorage.getItem("accessToken")
  );

  // --- HELPER: Handle Session Expiry ---
  const forceLogout = () => {
    console.warn("Session expired (401). Logging out to prevent loop.");
    localStorage.removeItem("access");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refresh"); // remove refresh token if you use it
    
    // Clearing state triggers a re-render. 
    // On next render, 'loggedIn' will be false, preventing new API calls.
    setCartItems([]); 
    
    // Optional: Redirect to login page
    // window.location.href = "/login"; 
  };

  useEffect(() => {
    if (loggedIn) {
      fetchCartFromBackend();
    } else {
      const stored = localStorage.getItem("cartItems");
      setCartItems(stored ? JSON.parse(stored) : []);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, loggedIn]);

  const fetchCartFromBackend = async () => {
    try {
      const res = await api.get("/cart/");
      setCartItems(normalizeCart(res.data));
    } catch (err) {
      // --- FIX: STOP THE LOOP ---
      if (err?.response?.status === 401) {
        forceLogout();
        return;
      }
      
      console.error(
        "Fetch cart error:",
        err?.response?.status,
        err?.response?.data || err.message
      );
    }
  };

  // Create (add 1 unit) – optimistic and line-specific
  const addToCart = async (menuItem) => {
    const lineCandidate = {
      id: toNum(menuItem.id ?? menuItem.menu_item_id),
      name: menuItem.name || "Item",
      price: Number(menuItem.price || 0),
      image: menuItem.image || menuItem.item_image_url || "",
      quantity: 1,
      restaurant_id: toNum(menuItem.restaurant_id ?? menuItem.restaurant),
    };

    if (loggedIn) {
      try {
        // Optimistic: add a new line (distinct lineId placeholder - Date.now())
        setCartItems((prev) => [
          ...prev,
          { ...lineCandidate, lineId: Date.now() },
        ]);

        // Server create
        const schema = await getCartPostSchema();
        const payload = buildCreatePayload(schema, lineCandidate, 1);
        await api.post("/cart/", payload, { headers: { "Content-Type": "application/json" } });

        await fetchCartFromBackend();
      } catch (error) {
        if (error?.response?.status === 401) {
          forceLogout();
          return;
        }

        console.error(
          "Add to cart error:",
          error?.response?.status,
          error?.response?.data || error.message
        );
        alert(
          `Failed to add to cart.\nStatus: ${error?.response?.status}\nDetails: ${
            error?.response?.data ? JSON.stringify(error.response.data) : "See console"
          }`
        );
        // rollback optimistic add
        setCartItems((prev) => prev.slice(0, -1));
      }
    } else {
      // Guest cart: add a new line entry (one line per click)
      setCartItems((prev) => [
        ...prev,
        { ...lineCandidate, lineId: Date.now() },
      ]);
    }
  };

  // Set absolute quantity of a specific line (by lineId):
  // delete that line on server, then re-create with desired quantity as a new line
  const updateLineQuantity = async (lineId, newQty) => {
    const lid = toNum(lineId);
    if (newQty < 1) return removeLineFromCart(lid);

    if (loggedIn) {
      try {
        const line = cartItems.find((i) => i.lineId === lid);
        if (!line) return;

        // Optimistic: adjust only this line
        setCartItems((prev) =>
          prev.map((i) =>
            i.lineId === lid ? { ...i, quantity: newQty } : i
          )
        );

        // Delete old line (ignore 404)
        try {
          await api.delete(`/cart/${lid}/`);
        } catch (eDel) {
          if (eDel?.response?.status && eDel.response.status !== 404) throw eDel;
        }

        // Re-create with desired quantity as a brand-new line
        const schema = await getCartPostSchema();
        const payload = buildCreatePayload(schema, line, newQty);
        await api.post("/cart/", payload, { headers: { "Content-Type": "application/json" } });

        await fetchCartFromBackend();
      } catch (err) {
        if (err?.response?.status === 401) {
          forceLogout();
          return;
        }

        console.error(
          "Update line quantity error:",
          err?.response?.status,
          err?.response?.data || err.message
        );
        alert(
          `Could not update quantity.\nStatus: ${err?.response?.status}\nDetails: ${
            err?.response?.data ? JSON.stringify(err.response.data) : "See console"
          }`
        );
      }
    } else {
      // Guest cart: adjust only this line
      setCartItems((prev) =>
        prev.map((i) =>
          i.lineId === lid ? { ...i, quantity: newQty } : i
        )
      );
    }
  };

  const removeLineFromCart = async (lineId) => {
    const lid = toNum(lineId);

    if (loggedIn) {
      try {
        // Optimistic
        setCartItems((prev) => prev.filter((i) => i.lineId !== lid));
        await api.delete(`/cart/${lid}/`);
        await fetchCartFromBackend();
      } catch (err) {
        if (err?.response?.status === 401) {
          forceLogout();
          return;
        }
        console.error(
          "Remove line error:",
          err?.response?.status,
          err?.response?.data || err.message
        );
      }
    } else {
      setCartItems((prev) => prev.filter((i) => i.lineId !== lid));
    }
  };

  // Legacy ID-based methods for compatibility
  const updateQuantity = (productId, newQty) => {
    const pid = toNum(productId);
    const line = cartItems.find((i) => i.id === pid);
    if (line) return updateLineQuantity(line.lineId, newQty);
  };

  const removeFromCart = (productId) => {
    const pid = toNum(productId);
    const line = cartItems.find((i) => i.id === pid);
    if (line) return removeLineFromCart(line.lineId);
  };

  const clearCart = async () => {
    if (loggedIn) {
      try {
        await api.delete("/cart/clear/");
        setCartItems([]);
      } catch (err) {
        if (err?.response?.status === 401) {
          forceLogout();
          return;
        }
        console.error(
          "Clear cart error:",
          err?.response?.status,
          err?.response?.data || err.message
        );
      }
    } else {
      setCartItems([]);
      localStorage.removeItem("cartItems");
    }
  };

  const totalItems = cartItems.reduce((acc, i) => acc + (i.quantity || 0), 0);
  const totalPrice = cartItems.reduce(
    (acc, i) => acc + (Number(i.price) || 0) * (i.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,                 // create a new line with qty=1
        updateLineQuantity,        // (lineId, newQty) — precise control
        removeLineFromCart,        // (lineId)         — precise control
        // backward compatible:
        updateQuantity,            // (productId, newQty)
        removeFromCart,            // (productId)
        clearCart,
        totalItems,
        totalPrice,
        fetchCartFromBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};