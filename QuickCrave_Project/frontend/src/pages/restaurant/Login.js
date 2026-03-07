import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import { restaurantLogin } from "../../api/restaurantAuth";

function RestaurantLogin() {
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
      const result = await restaurantLogin(username, password);

      if (result.success) {
        // Auth is already set by restaurantLogin function
        navigate("/restaurant-panel/dashboard");
      } else {
        // If response has errors object
        const errorMsg = result.errors?.username?.[0] ||
          result.errors?.password?.[0] ||
          result.message ||
          "Login failed. Please try again.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Login error:", err);

      // Handle different error scenarios
      let errorMessage = "Invalid username or password";

      if (err.response?.data?.errors?.username?.[0]) {
        errorMessage = err.response.data.errors.username[0];
      } else if (err.response?.data?.errors?.password?.[0]) {
        errorMessage = err.response.data.errors.password[0];
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message === "Network Error") {
        errorMessage = "Unable to connect to server. Please check your connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (

    <Box
      sx={{
        minHeight: "95vh",
        background: "linear-gradient(135deg, #ecfeff, #d1fae5)",
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
          bgcolor: "#ffffff",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, mb: 1, color: "#047857" }}
        >
          Restaurant Login
        </Typography>

        <Typography sx={{ color: "#555", mb: 3 }}>
          Sign in to manage your restaurant
        </Typography>

        {error && (
          <Box
            sx={{
              bgcolor: "#fee2e2",
              color: "#991b1b",
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
              backgroundColor: "#047857",
              "&:hover": { backgroundColor: "#065f46" },
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <Typography sx={{ mt: 2, textAlign: "center", fontSize: 14 }}>
          New Restaurant?{" "}
          <Link to="/restaurant/register" style={{ color: "#047857" }}>
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default RestaurantLogin;