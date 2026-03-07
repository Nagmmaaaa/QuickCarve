import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import {
  restaurantRegister,
  isRestaurantLoggedIn,
} from "../../api/restaurantAuth";

function RestaurantRegister() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    restaurant_name: "",
    cuisine: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (isRestaurantLoggedIn()) {
      navigate("/restaurant-panel/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.first_name) return setError("First name required"), false;
    if (!formData.email) return setError("Email required"), false;
    if (!formData.phone) return setError("Phone required"), false;
    if (formData.password.length < 8)
      return setError("Password must be at least 8 characters"), false;
    if (formData.password !== formData.confirm_password)
      return setError("Passwords do not match"), false;
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.restaurant_name) {
      setError("Restaurant name required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await restaurantRegister(formData);
      if (res.success) {
        navigate("/restaurant-panel/dashboard");
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Try again.");
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
          maxWidth: 450,
          bgcolor: "#fff",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#047857" }}
        >
          Restaurant Registration
        </Typography>

        <Typography sx={{ color: "#555", mb: 3 }}>
          Step {step} of 2
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

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <TextField label="First Name" name="first_name" fullWidth size="small" sx={{ mb: 2 }} value={formData.first_name} onChange={handleChange} />
              <TextField label="Last Name" name="last_name" fullWidth size="small" sx={{ mb: 2 }} value={formData.last_name} onChange={handleChange} />
              <TextField label="Email" name="email" type="email" fullWidth size="small" sx={{ mb: 2 }} value={formData.email} onChange={handleChange} />
              <TextField label="Phone" name="phone" fullWidth size="small" sx={{ mb: 2 }} value={formData.phone} onChange={handleChange} />
              <TextField label="Password" name="password" type="password" fullWidth size="small" sx={{ mb: 2 }} value={formData.password} onChange={handleChange} />
              <TextField label="Confirm Password" name="confirm_password" type="password" fullWidth size="small" sx={{ mb: 3 }} value={formData.confirm_password} onChange={handleChange} />

              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  backgroundColor: "#047857",
                  "&:hover": { backgroundColor: "#065f46" },
                }}
                onClick={handleNext}
              >
                Continue
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField label="Restaurant Name" name="restaurant_name" fullWidth size="small" sx={{ mb: 2 }} value={formData.restaurant_name} onChange={handleChange} />

              <TextField label="Cuisine" name="cuisine" select fullWidth size="small" sx={{ mb: 2 }} value={formData.cuisine} onChange={handleChange}>
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="North Indian">North Indian</MenuItem>
                <MenuItem value="South Indian">South Indian</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="Multi-Cuisine">Multi-Cuisine</MenuItem>
              </TextField>

              <TextField label="City" name="city" fullWidth size="small" sx={{ mb: 2 }} value={formData.city} onChange={handleChange} />

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
                {loading ? "Creating..." : "Register"}
              </Button>
            </>
          )}
        </form>

        <Typography sx={{ mt: 2, textAlign: "center", fontSize: 14 }}>
          Already registered?{" "}
          <Link to="/restaurant/login" style={{ color: "#047857" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default RestaurantRegister;