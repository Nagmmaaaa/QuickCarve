// src/components/Footer.js
import React from "react";
import { Box, Container, Typography, Stack, Divider, IconButton } from "@mui/material";
import { Restaurant as RestaurantIcon, Favorite as FavoriteIcon } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#000000",
        color: "#fff",
        py: 5,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">

        {/* 3 columns: Brand | Links | Social */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "flex-start" }}
          spacing={4}
          mb={4}
        >

          {/* Column 1 - Brand */}
          <Stack alignItems={{ xs: "center", md: "flex-start" }} spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  bgcolor: "#22c55e",
                  borderRadius: "10px",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RestaurantIcon sx={{ color: "#fff", fontSize: 22 }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#22c55e" }}>
                QuickCrave
              </Typography>
            </Stack>

            <Typography sx={{ color: "#9ca3af", fontSize: "0.85rem", maxWidth: 200, textAlign: { xs: "center", md: "left" } }}>
              Fresh food delivered fast — your hunger ends here.
            </Typography>
          </Stack>

          {/* Column 2 - Links */}
          <Stack alignItems={{ xs: "center", md: "flex-start" }} spacing={1.5}>
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem" }}>
              Support
            </Typography>

            <Box
              component={Link}
              to="/faq"
              sx={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", "&:hover": { color: "#22c55e" } }}
            >
              FAQ
            </Box>

            <Box
              component={Link}
              to="/contact"
              sx={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.9rem", "&:hover": { color: "#22c55e" } }}
            >
              Contact Us
            </Box>
          </Stack>

          {/* Column 3 - Social */}
          <Stack alignItems={{ xs: "center", md: "flex-start" }} spacing={1.5}>
            <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "0.95rem" }}>
              Follow Us
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                size="small"
                sx={{ color: "#9ca3af", "&:hover": { color: "#22c55e" } }}
              >
                <FacebookIcon />
              </IconButton>

              <IconButton
                href="https://instagram.com"
                target="_blank"
                size="small"
                sx={{ color: "#9ca3af", "&:hover": { color: "#22c55e" } }}
              >
                <InstagramIcon />
              </IconButton>

              <IconButton
                href="https://twitter.com"
                target="_blank"
                size="small"
                sx={{ color: "#9ca3af", "&:hover": { color: "#22c55e" } }}
              >
                <TwitterIcon />
              </IconButton>
            </Stack>
          </Stack>

        </Stack>

        {/* Divider */}
        <Divider sx={{ borderColor: "#1f2937", mb: 3 }} />

        {/* Bottom: copyright */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography sx={{ color: "#6b7280", fontSize: "0.82rem" }}>
            © {new Date().getFullYear()} QuickCrave. All rights reserved.
          </Typography>

          <Typography sx={{ color: "#6b7280", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 0.5 }}>
            Made with <FavoriteIcon sx={{ fontSize: 14, color: "#ef4444" }} /> in India
          </Typography>
        </Stack>

      </Container>
    </Box>
  );
};

export default Footer;