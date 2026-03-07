// src/pages/RegisterPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Box, TextField, Button } from "@mui/material";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/register/", {
        username,
        email,
        password,
      });
      if (res.status === 201) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      setError(String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "93vh",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Main Card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 450,
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >

        <Box
          sx={{
            flex: 1,
            padding: { xs: "30px 20px", md: "40px" },
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "#22c55e" }}>
            Create Account
          </Typography>
          <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
            Fill in your details to get started
          </Typography>

          <form onSubmit={handleRegister}>
            {/* Username */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
                Username
              </Typography>
              <TextField
                fullWidth
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                variant="outlined"
                size="small"
              />
            </Box>

            {/* Email */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                size="small"
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                size="small"
              />
            </Box>

            {/* Error Message */}
            {error && (
              <Box
                sx={{
                  background: "#fee",
                  color: "#c00",
                  padding: "10px",
                  borderRadius: "8px",
                  mb: 2,
                  fontSize: 14,
                }}
              >
                {error}
              </Box>
            )}

            {/* Success Message */}
            {success && (
              <Box
                sx={{
                  background: "#d4edda",
                  color: "#155724",
                  padding: "10px",
                  borderRadius: "8px",
                  mb: 2,
                  fontSize: 14,
                }}
              >
                {success}
              </Box>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={submitting}
              sx={{
                textTransform: "none",
                padding: "12px",
                fontSize: 16,
                fontWeight: 600,
                backgroundColor: "#22c55e",
                "&:hover": { backgroundColor: "#16a34a" },
                mb: 2,
              }}
            >
              {submitting ? "Creating Account..." : "Register"}
            </Button>
          </form>

          {/* Login Link */}
          <Typography sx={{ textAlign: "center", fontSize: 14, color: "#666" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#22c55e",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterPage;