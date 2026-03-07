import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Select,
  FormControl,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../../api/http";

const STATUS_COLORS = {
  Pending: "warning",
  Confirmed: "info",
  Cooking: "info",
  "Out for Delivery": "primary",
  Delivered: "success",
  Cancelled: "error",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/");
      setOrders(res.data || []);
    } catch (err) {
      setError("Failed to load orders. Admin access required.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto refresh every 30 seconds
    const timer = setInterval(fetchOrders, 30000);
    return () => clearInterval(timer);
  }, []);

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    const oldOrders = [...orders];

    // Update UI first
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    try {
      await api.patch(`/orders/${orderId}/`, { status: newStatus });
    } catch (err) {
      alert("Failed to update status");
      setOrders(oldOrders); // rollback
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        Order Management
      </Typography>

      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography>No orders found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Customer</b></TableCell>
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Total</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Update</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    {order.user?.username || "Guest"}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>₹{order.total_price}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={STATUS_COLORS[order.status] || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl size="small">
                      <Select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                      >
                        {Object.keys(STATUS_COLORS).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}