import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cartItems, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const tax = totalPrice * 0.05;
  const finalTotal = totalPrice + deliveryFee + tax;

  const handlePlaceOrder = () => {
    if (!address.name || !address.phone || !address.street || !address.city) {
      alert("Please fill all required fields");
      return;
    }
    clearCart();
    navigate("/order-success");
  };

  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f0fdf4",
        }}
      >
        <Typography>Your cart is empty</Typography>
      </Box>
    );
  }

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "#fff",
      "&:hover fieldset": { borderColor: "#22c55e" },
      "&.Mui-focused fieldset": { borderColor: "#22c55e" },
    },
    "& label.Mui-focused": { color: "#22c55e" },
  };

  return (
    <Box sx={{ bgcolor: "#f0fdf4", minHeight: "100vh", py: 6 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
        <Typography sx={{ fontSize: 30, fontWeight: 700, mb: 4, color: "#000" }}>
          Checkout
        </Typography>

        <Grid container spacing={4} alignItems="flex-start">
          {/* LEFT SIDE */}
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>

              {/* Contact Information */}
              <Paper sx={{ p: 4, borderRadius: 2, border: "1px solid #dcfce7" }}>
                <Typography sx={{ fontWeight: 700, mb: 1, fontSize: 16, color: "#000000", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Contact Information
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#6b7280", mb: 3 }}>* Required</Typography>

                <Stack spacing={2}>
                  <TextField label="Email *" fullWidth sx={inputStyle}
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  />
                  <TextField label="Mobile Number *" fullWidth sx={inputStyle}
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  />
                </Stack>
              </Paper>

              {/* Shipping Address */}
              <Paper sx={{ p: 4, borderRadius: 2, border: "1px solid #dcfce7" }}>
                <Typography sx={{ fontWeight: 700, mb: 3, fontSize: 16, color: "#000000", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Shipping Address
                </Typography>

                <Stack spacing={2}>
                  <TextField label="Full Name *" fullWidth sx={inputStyle}
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  />
                  <TextField label="Street Address *" fullWidth sx={inputStyle}
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={5}>
                      <TextField label="City *" fullWidth sx={inputStyle}
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField label="State" fullWidth sx={inputStyle}
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField label="Pincode" fullWidth sx={inputStyle}
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>

              {/* Payment Info */}
              <Paper sx={{ p: 4, borderRadius: 2, border: "1px solid #dcfce7" }}>
                <Typography sx={{ fontWeight: 700, mb: 3, fontSize: 16, color: "#000000", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Payment Info
                </Typography>

                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: "2px solid #22c55e",
                  bgcolor: "#f0fdf4",
                }}>
                  <Box sx={{
                    width: 20, height: 20, borderRadius: "50%",
                    bgcolor: "#22c55e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fff" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>Cash on Delivery</Typography>
                    <Typography sx={{ fontSize: 12, color: "#6b7280" }}>Pay when your order arrives</Typography>
                  </Box>
                </Box>
              </Paper>

            </Stack>
          </Grid>

          {/* RIGHT SIDE - Order Summary */}
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 2,
                border: "1px solid #dcfce7",
                position: { md: "sticky" },
                top: 100,
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 3, fontSize: 16, color: "#000000", textTransform: "uppercase", letterSpacing: 0.5 }}>
                Order Summary
              </Typography>

              {/* Cart Items */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                {cartItems.map((item, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {item.image && (
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{ width: 44, height: 44, borderRadius: 2, objectFit: "cover", border: "1px solid #e5e7eb" }}
                        />
                      )}
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{item.name}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#6b7280" }}>Qty: {item.quantity}</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ borderColor: "#dcfce7" }} />

              {/* Price Breakdown */}
              <Stack spacing={1.5} sx={{ my: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#6b7280", fontSize: 14 }}>Subtotal</Typography>
                  <Typography sx={{ fontSize: 14 }}>₹{totalPrice.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#6b7280", fontSize: 14 }}>Delivery</Typography>
                  <Typography sx={{ fontSize: 14, color: deliveryFee === 0 ? "#22c55e" : "inherit", fontWeight: deliveryFee === 0 ? 600 : 400 }}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "#6b7280", fontSize: 14 }}>Tax (5%)</Typography>
                  <Typography sx={{ fontSize: 14 }}>₹{tax.toFixed(2)}</Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor: "#dcfce7" }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 4 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 17 }}>Total</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#22c55e" }}>
                  ₹{finalTotal.toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handlePlaceOrder}
                sx={{
                  bgcolor: "#22c55e",
                  py: 1.8,
                  fontWeight: 700,
                  fontSize: 15,
                  borderRadius: 2,
                  letterSpacing: 1,
                  "&:hover": { bgcolor: "#16a34a" },
                  boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                }}
              >
                PLACE ORDER
              </Button>

              {totalPrice <= 500 && (
                <Typography sx={{ textAlign: "center", fontSize: 12, color: "#6b7280", mt: 2 }}>
                  Add ₹{(500 - totalPrice).toFixed(0)} more for FREE delivery
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CheckoutPage;