// src/pages/LandingPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Container,
} from "@mui/material";

// Material UI Icons
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";

const pizzaHero = "https://images.pexels.com/photos/28760148/pexels-photo-28760148.jpeg";

const FEATURES = [
  {
    title: "Fast Delivery",
    desc: "Optimised routes inside mumbai so your food reaches hot.",
  },
  {
    title: "Top Restaurants",
    desc: "A focused list of kitchens loved by locals.",
  },
  {
    title: "Easy Ordering",
    desc: "Clean checkout with clear ETAs and live tracking.",
  },
  {
    title: "Simple Cart",
    desc: "Add, update, and remove food items easily before checkout.",
  },
];

const OFFERS = [
  {
    label: "Barbeque Nation",
    title: "Family Grill Feast – Flat 15% OFF",
    desc: "Unlimited grills & desserts when ordering online.",
    img: "https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg",
  },
  {
    label: "Mocha",
    title: "Coffee & Dessert Combo at ₹249",
    desc: "Any classic coffee + brownie/waffle in one combo.",
    img: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg",
  },
  {
    label: "Penthouse",
    title: "1+1 on kebab platters",
    desc: "Order any kebab platter and get one free.",
    img: "https://www.shutterstock.com/image-photo/assorted-mix-grills-chicken-tikka-600w-2290851499.jpg",
  },
];

function LandingPage() {
  const navigate = useNavigate();
  const [offerIndex, setOfferIndex] = useState(0);

  const storedUsername = localStorage.getItem("username");
  const usernameInitial = storedUsername ? storedUsername.charAt(0).toUpperCase() : null;

  // Auto-rotate offers every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setOfferIndex((prev) => (prev + 1) % OFFERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ width: "100%", bgcolor: "#f5f5f5" }}>

      {/* HERO SECTION */}
      <Box sx={{ bgcolor: "#fff", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#22c55e",
                  mb: 1,
                }}
              >
                Mumbai Specials
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 36, md: 48 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Cravings, delivered just right
              </Typography>

              <Typography sx={{ fontSize: 16, color: "#666", mb: 3 }}>
                The most-loved restaurants of Mumbai delivered fast.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/restaurants")}
                sx={{
                  bgcolor: "#22c55e",
                  px: 2,
                  py: 1.5,
                  fontSize: 14,
                  "&:hover": {
                    bgcolor: "#16a34a",
                  },
                }}
              >
                Order Now
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  width: 300,
                  height: 300,
                  mx: "auto",
                }}
              >
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "10px solid #fff",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  }}
                >
                  <Box
                    component="img"
                    src={pizzaHero}
                    alt="Pizza"
                    sx={{
                      width: "100%",
                      height: "120%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: -8,
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "#ef4444",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 25px rgba(239,68,68,0.35)",
                  }}
                >
                  <Typography sx={{ fontSize: 11, lineHeight: 1 }}>
                    Best offer
                  </Typography>
                  <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
                    -50%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Box sx={{ py: 8, bgcolor: "#f0fdf4" }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: 700,
              mb: 1,
            }}
          >
            Why Choose QuickCrave?
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: 16,
              color: "#666",
              mb: 5,
            }}
          >
            Built for Mumbai with faster delivery and better partners.
          </Typography>

          <Grid container spacing={3}>
            {FEATURES.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 2,
                    height: "60%",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 700,
                      mb: 1,
                      color: "#22c55e",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "#666" }}>
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* OFFERS SECTION */}
      <Box sx={{ py: 8, bgcolor: "#fff" }}>
        <Container maxWidth="md">
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 32,
              fontWeight: 700,
              mb: 1,
            }}
          >
            Today's Offers
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: 16,
              color: "#666",
              mb: 4,
            }}
          >
            Running deals from top restaurants in Mumbai.
          </Typography>

          <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Grid container>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    height: { xs: 200, md: 250 },
                    backgroundImage: `url(${OFFERS[offerIndex].img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Grid>

              <Grid item xs={12} md={7}>
                <Box sx={{ p: 4 }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "#ef4444",
                      mb: 1,
                    }}
                  >
                    {OFFERS[offerIndex].label}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    {OFFERS[offerIndex].title}
                  </Typography>

                  <Typography sx={{ fontSize: 14, color: "#666", mb: 3 }}>
                    {OFFERS[offerIndex].desc}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => navigate("/restaurants")}
                    sx={{ bgcolor: "#111827" }}
                  >
                    Explore
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Offer Dots */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 1 }}>
            {OFFERS.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setOfferIndex(idx)}
                sx={{
                  width: offerIndex === idx ? 20 : 10,
                  height: 10,
                  borderRadius: 5,
                  bgcolor: offerIndex === idx ? "#ef4444" : "#ddd",
                  cursor: "pointer",
                }}
              />
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;