// src/components/Navbar.js
import { Box, Typography, Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // for profile circle (optional, simple)
  const usernameInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "?";

  return (
    <>
      {/* NAVBAR */}
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* LOGO */}
            <Typography
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "#111827",
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              QuickCrave
            </Typography>

            {/* NAV LINKS */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Home
              </Typography>

              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/restaurants")}
              >
                Restaurants
              </Typography>

              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/about")}
              >
                About
              </Typography>
            </Box>

            {/* AUTH / PROFILE */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!user ? (
                <>
                  {/* Login */}
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      textTransform: "none",
                      fontWeight: 400,
                      color: "#000000",
                      borderRadius: "10px",
                      px: 3,
                    }}
                  >
                    Login
                  </Button>

                  {/* Sign Up */}
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      bgcolor: "#22c55e",
                      borderRadius: "10px",
                      px: 3,
                      boxShadow: "0 4px 10px rgba(34, 197, 94, 0.3)",
                      "&:hover": {
                        bgcolor: "#16a34a",
                      },
                    }}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <Box
                  component={Link}
                  to="/profile"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#f0fdf4",
                    border: "2px solid #22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 600,
                    textDecoration: "none",
                    color: "#111827",
                  }}
                >
                  {usernameInitial}
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Navbar;
