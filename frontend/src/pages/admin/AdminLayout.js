import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  People,
  Restaurant,
  Inventory,
  Category,
  ShoppingCart,
  ListAlt,
  Group,
  LocalShipping,
  Block,
  Logout,
} from "@mui/icons-material";

const drawerWidth = 240;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin" },
    { text: "Restaurants", icon: <Restaurant />, path: "/admin/restaurants" },
    { text: "Categories", icon: <Category />, path: "/admin/categories" },
    { text: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
  ];

  const drawer = (
    <Box sx={{ height: "100%", bgcolor: "#166534", color: "#fff" }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          QuickCrave
        </Typography>
        <Typography variant="body2">
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                color: "#fff",
                "&.active": {
                  bgcolor: "#14532d",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.2)" }} />

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/admin/login")} sx={{ color: "#fff" }}>
            <ListItemIcon sx={{ color: "#fff" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Area */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{ bgcolor: "#ffffff", color: "#166534", boxShadow: 1 }}
        >
          <Toolbar>
            <Typography variant="h6" fontWeight="bold">
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, bgcolor: "#f9fafb", minHeight: "100vh" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}