// src/pages/CartPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateLineQuantity, removeLineFromCart, totalPrice } =
    useCart();

  const subtotal = Number(totalPrice || 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.05;
  const finalTotal = subtotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h6">Your cart is empty</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "70vh", bgcolor: "#f0fdf4", py: 12 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>

        <Typography sx={{ fontSize: 35, fontWeight: 700, mb: 3 }}>
          🛒 Your Cart
        </Typography>

        {/*  TWO LAYOUT DIVS */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
          }}
        >
          {/* LEFT */}
          <Box
            sx={{
              flex: 2,
              p: 1,
              borderRadius: 2,
            }}
          >
            {cartItems.map((item) => (
              <Box
                key={item.lineId}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  p: 2,
                  mb: 2,                
                  border: "1px solid #e5e7eb",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "#666" }}>
                      ₹{item.price}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        item.quantity > 1
                          ? updateLineQuantity(item.lineId, item.quantity - 1)
                          : removeLineFromCart(item.lineId)
                      }
                    >
                      <Remove />
                    </IconButton>

                    <Typography sx={{ fontWeight: 600 }}>
                      {item.quantity}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() =>
                        updateLineQuantity(item.lineId, item.quantity + 1)
                      }
                    >
                      <Add />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => removeLineFromCart(item.lineId)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* RIGHT */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "#fff",
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontWeight: 700, mb: 2 }}>
              Order Summary
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>₹{subtotal.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Delivery</Typography>
              <Typography>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Tax (5%)</Typography>
              <Typography>₹{tax.toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography sx={{ fontWeight: 700, color: "#22c55e" }}>
                ₹{finalTotal.toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#22c55e",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#16a34a" },
              }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartPage;


