import React from "react";
import { Container, Typography, Box, Button, Paper, Divider, Stack, Grid } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const OrderSuccessPage = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || "N/A";
  const orderData = location.state?.orderData;
  const cartItems = location.state?.cartItems || [];
  const total = location.state?.total || 0;

  return (
    <Box
      sx={{
        minHeight: "95vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          {/* Success Icon */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "#22c55e", mb: 2 }}
            />

            <Typography variant="h4" fontWeight={700} gutterBottom>
              Order Confirmed! 🎉
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Thank you for your order. Your food is being prepared.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Order Details */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1 }}>
                Order ID: <span style={{ color: "#22c55e", fontWeight: 700 }}>#{orderId}</span>
              </Typography>
            </Grid>

            {/* Items Summary */}
            {cartItems.length > 0 && (
              <Grid item xs={12}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2, color: "#000" }}>
                  Order Items:
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                  {cartItems.map((item, idx) => (
                    <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                      <Typography sx={{ fontSize: 14 }}>
                        {item.name} × {item.quantity}
                      </Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
            )}

            {/* Total Amount */}
            {total > 0 && (
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: "#f0fdf4", 
                  borderRadius: 1, 
                  border: "1px solid #dcfce7",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Total Amount:</Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>
                    ₹{total.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
                <strong>Estimated Delivery:</strong> 25–35 minutes
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ fontSize: 14, color: "#6b7280" }}>
                <strong>Payment Method:</strong> Cash on Delivery
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#22c55e",
                textTransform: "none",
                fontWeight: 600,
                py: 1.5,
                "&:hover": {
                  bgcolor: "#16a34a",
                },
              }}
            >
              Continue Shopping
            </Button>

            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#22c55e",
                color: "#22c55e",
                textTransform: "none",
                fontWeight: 600,
                py: 1.5,
              }}
            >
              Track Order
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OrderSuccessPage;