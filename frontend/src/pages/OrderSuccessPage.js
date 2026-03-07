import React from "react";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const OrderSuccessPage = () => {
  const orderNumber = `QC${Date.now().toString().slice(-6)}`;

  return (
    <Box
      sx={{
        minHeight: "95vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          {/* Success Icon */}
          <CheckCircleIcon
            sx={{ fontSize: 80, color: "#22c55e", mb: 2 }}
          />

          <Typography variant="h4" fontWeight={700} gutterBottom>
            Order Confirmed!
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Thank you for your order. Your food is being prepared.
          </Typography>

          <Typography sx={{ mb: 1 }}>
            <strong>Order ID:</strong> {orderNumber}
          </Typography>

          <Typography sx={{ mb: 3 }}>
            <strong>Estimated Delivery:</strong> 25–35 minutes
          </Typography>

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{
                bgcolor: "#22c55e",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                    bgcolor: "#16a34a",
                  },
              }}
            >
              Go to Home
            </Button>

            <Button
              component={Link}
              to="/profile"
              variant="outlined"
              sx={{
                borderColor: "#22c55e",
                color: "#22c55e",
                textTransform: "none",
                fontWeight: 600,
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