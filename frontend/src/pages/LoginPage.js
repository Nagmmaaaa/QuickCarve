// src/pages/LoginPage.js
import React, { useState } from "react";
import api from "../api/http";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, Typography, TextField, Button } from "@mui/material";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await api.post("/auth/token/", {
        username,
        password,
      });

      const { access } = res.data;

      localStorage.setItem("access", access);

      const userRes = await api.get("/users/me/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      login(userRes.data);
      navigate(from, { replace: true });

    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };

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
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >

        <Box
          sx={{
            flex: 1,
            p: { xs: 3, md: 5 },
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 1, color: "#22c55e" }}
          >
            Login
          </Typography>

          <Typography sx={{ color: "#666", mb: 3 }}>
            Enter your details to continue
          </Typography>

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
                Username
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Box>

            {error && (
              <Box
                sx={{
                  background: "#fee",
                  color: "#c00",
                  p: 1,
                  borderRadius: "8px",
                  mb: 2,
                  fontSize: 14,
                }}
              >
                {error}
              </Box>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              sx={{
                textTransform: "none",
                p: 1.5,
                fontWeight: 600,
                backgroundColor: "#22c55e",
                "&:hover": { backgroundColor: "#16a34a" },
                mb: 2,
              }}
            >
              {submitting ? "Signing in..." : "Login"}
            </Button>
          </form>

          <Typography sx={{ textAlign: "center", fontSize: 14, color: "#666" }}>
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#22c55e",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
