import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
  Avatar,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  RestaurantMenu,
  ShoppingCart,
  Settings,
  Logout,
} from "@mui/icons-material";

import {
  getRestaurantData,
  getRestaurantUser,
  restaurantLogout,
} from "../../api/restaurantAuth";

const drawerWidth = 240;

const RestaurantLayout = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setRestaurant(getRestaurantData());
    setUser(getRestaurantUser());
  }, []);

  const handleLogout = async () => {
    await restaurantLogout();
    navigate("/restaurant/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/restaurant-panel/dashboard" },
    { text: "Menu", icon: <RestaurantMenu />, path: "/restaurant-panel/menu" },
    { text: "Orders", icon: <ShoppingCart />, path: "/restaurant-panel/orders" },
    { text: "Settings", icon: <Settings />, path: "/restaurant-panel/settings" },
  ];

  const drawer = (
    <Box sx={{ height: "100%", bgcolor: "#064e3b", color: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          QuickCrave
        </Typography>
        <Typography variant="body2" sx={{ color: "#d1fae5" }}>
          Restaurant Panel
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

      {/* Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                color: "#ffffff",
                "&.active": {
                  bgcolor: "#047857",
                },
                "&:hover": {
                  bgcolor: "#065f46",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#d1fae5" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.2)" }} />

        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: "#ffffff",
              "&:hover": { bgcolor: "#7f1d1d" },
            }}
          >
            <ListItemIcon sx={{ color: "#fecaca" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Profile */}
      <Box sx={{ p: 2, mt: "auto" }}>
        <Avatar sx={{ bgcolor: "#10b981", mb: 1 }}>
          {restaurant?.name?.[0] || "R"}
        </Avatar>
        <Typography variant="body2">
          {restaurant?.name || "Restaurant"}
        </Typography>
        <Typography variant="caption" sx={{ color: "#d1fae5" }}>
          {user?.first_name || "Owner"}
        </Typography>
      </Box>
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
          sx={{
            bgcolor: "#ffffff",
            color: "#047857",
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <Typography variant="h6" fontWeight="bold">
              Welcome Back 👋
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3, bgcolor: "#f0fdfa", minHeight: "100vh" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default RestaurantLayout;