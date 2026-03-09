import React, { useState } from "react";
import api from "../../api/http";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      //  Get JWT token
      const res = await api.post("/auth/token/", {
        username,
        password,
      });

      const { access } = res.data;
      localStorage.setItem("admin_access", access);

      //  Get user info
      const userRes = await api.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      //  Check admin permission
      if (userRes.data.is_staff) {
        navigate("/admin");
      } else {
        setError("You are not an admin");
        localStorage.removeItem("admin_access");
      }

    } catch (err) {
      setError("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "95vh",
        background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          bgcolor: "#fff",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 1, color: "#166534" }}
        >
          Admin Login
        </Typography>

        <Typography sx={{ color: "#555", mb: 3 }}>
          Sign in to access admin panel
        </Typography>

        {error && (
          <Box
            sx={{
              bgcolor: "#fee",
              color: "#c00",
              p: 1,
              borderRadius: 2,
              mb: 2,
              fontSize: 14,
            }}
          >
            {error}
          </Box>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            size="small"
            sx={{ mb: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              fontWeight: 600,
              backgroundColor: "#166534",
              "&:hover": { backgroundColor: "#14532d" },
            }}
          >
            {loading ? "Signing in..." : "Login as Admin"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default AdminLogin;