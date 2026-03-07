// src/pages/AboutPage.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const plateImg =
  "https://images.pexels.com/photos/35290662/pexels-photo-35290662.png";

const storedUsername = localStorage.getItem("username");
const usernameInitial = storedUsername ? storedUsername.charAt(0).toUpperCase() : null;

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#f5f5f5", color: "#111827" }}>


      {/* main content */}
      <Box sx={{ py: 6 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
          <Box
            sx={{
              borderRadius: 4,
              bgcolor: "#ffffff",
              p: 6,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 4,
              }}
            >
              {/* LEFT TEXT */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    color: "#22c55e",
                    mb: 1,
                  }}
                >
                  Cravings don't wait. Neither do we.
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                  }}
                >
                  Your favorite Mumbai meals, just a few clicks away.
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    color: "#4b5563",
                    mb: 1.5,
                  }}
                >
                  QuickCrave connects you to popular local restaurants
                  across Mumbai with a simple and reliable ordering
                  experience.
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#4b5563",
                    mb: 3,
                  }}
                >
                  From late-night snacks to comfort meals, order your
                  favorite dishes easily and get them delivered fresh
                  to your doorstep.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => navigate("/restaurants")}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontSize: 14,
                    fontWeight: 600,
                    bgcolor: "#22c55e",
                    "&:hover": { bgcolor: "#16a34a" },
                  }}
                >
                  Explore Restaurants
                </Button>
              </Box>

              {/* RIGHT IMAGE */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  width: "100%",
                }}
              >
                <Box
                  component="img"
                  src={plateImg}
                  alt="Food plate"
                  sx={{
                    width: "100%",
                    maxWidth: 500,
                    height: 320,
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutPage;