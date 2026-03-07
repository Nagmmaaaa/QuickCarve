// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";
import {
  Container, Box, Typography, Button, Avatar,
  Grid, TextField, Alert,
  Tabs, Tab, Paper, Card, CardContent
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ShoppingBag as ShoppingBagIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

function ProfilePage() {
  const [user, setUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const access = localStorage.getItem("access") || localStorage.getItem("accessToken");
    if (!access) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const profileRes = await api.get("/profile/");
        const p = profileRes.data;
        setUser({
          username: p.username || "",
          first_name: p.first_name || "",
          last_name: p.last_name || "",
          email: p.email || "",
          phone: p.phone || "",
          address: p.address || "",
        });

        const orderRes = await api.get("/orders/");
        const list = Array.isArray(orderRes.data) ? orderRes.data : orderRes.data?.results || [];
        setOrders(list);
        setError("");
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await api.put("/profile/", {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        address: user.address,
      });

      if (response.data) {
        setUser(response.data);
      }

      setMessage("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate("/");
  };

  const getDisplayName = () => {
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    return user.username || "User";
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: "center" }}>
          My Profile
        </Typography>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
          {/* Left Sidebar - Fixed Width */}
          <Box sx={{ width: { xs: "100%", md: "320px" }, flexShrink: 0 }}>
            {/* User Card */}
            <Paper sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto 16px",
                    bgcolor: "#22c55e",
                    fontSize: "2rem",
                  }}
                >
                  {getDisplayName().charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {getDisplayName()}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                  @{user.username}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                  {user.email}
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ color: "#22c55e", borderColor: "#22c55e" }}
                >
                  Logout
                </Button>
              </Box>
            </Paper>

            {/* Stats Cards */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <ShoppingBagIcon sx={{ fontSize: 40, color: "#22c55e", mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {orders.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", fontSize: "0.85rem" }}>
                    Total Orders
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ flex: 1 }}>
                <CardContent sx={{ textAlign: "center", p: 2 }}>
                  <AccountCircleIcon sx={{ fontSize: 40, color: "#2196f3", mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Active
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", fontSize: "0.85rem" }}>
                    Status
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Right Content Area - Flexible */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper sx={{ borderRadius: 2 }}>
              <Tabs
                value={tab}
                onChange={(_, newVal) => setTab(newVal)}
                sx={{
                  borderBottom: "1px solid #e0e0e0",
                  px: 2,
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#333", 
                  },
                }}
              >
                <Tab
                  label="Profile Info"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#666", 
                    "&.Mui-selected": {
                      color: "#000", 
                    },
                  }}
                />
                <Tab
                  label="Orders"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#666",
                    "&.Mui-selected": {
                      color: "#000",
                    },
                  }}
                />
              </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Profile Info Tab */}
            {tab === 0 && (
              <Box>
                {!editMode ? (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }} >
                        Personal Information
                      </Typography>
                      <Button
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                        variant="contained"
                        sx={{ bgcolor: "#22c55e", "&:hover": { bgcolor: "#16a34a" } }}
                      >
                        Edit
                      </Button>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", display: "block", mb: 0.5 }}>
                            First Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.first_name || "Not set"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", display: "block", mb: 0.5 }}>
                            Last Name
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.last_name || "Not set"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", display: "block", mb: 0.5 }}>
                            Phone
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.phone || "Not set"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", display: "block", mb: 0.5 }}>
                            Email
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.email || "Not set"}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: "#666", textTransform: "uppercase", display: "block", mb: 0.5 }}>
                            Address
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {user.address || "Not set"}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Box component="form" onSubmit={handleUpdate}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Edit Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={user.first_name}
                          onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={user.last_name}
                          onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          value={user.username}
                          onChange={(e) => setUser({ ...user, username: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone"
                          value={user.phone}
                          onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          value={user.address}
                          onChange={(e) => setUser({ ...user, address: e.target.value })}
                          multiline
                          rows={2}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        sx={{ bgcolor: "#22c55e", "&:hover": { bgcolor: "#16a34a" } }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditMode(false)}
                        sx={{ color: "#666", borderColor: "#ddd" }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Orders Tab */}
            {tab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  My Orders
                </Typography>

                {orders.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <ShoppingBagIcon sx={{ fontSize: 60, color: "#ddd", mb: 2 }} />
                    <Typography variant="h6" sx={{ color: "#999", mb: 1 }}>
                      No orders yet
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/restaurants")}
                      sx={{ mt: 2, bgcolor: "#22c55e", "&:hover": { bgcolor: "#16a34a" } }}
                    >
                      Start Ordering
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    {orders.map((order, index) => (
                      <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Order #{order.id || order.order_id}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                                {order.restaurant_name || "Restaurant"}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#666" }}>
                                Status: {order.status || "Pending"}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ color: "#22c55e", fontWeight: 600 }}>
                                ₹{order.total_amount || 0}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Paper>
    </Box>
        </Box >
      </Container >
    </Box >
  );
}

export default ProfilePage;