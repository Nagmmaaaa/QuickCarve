// src/components/RestaurantCard.js
import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  const rid =
    restaurant.id ??
    restaurant.pk ??
    restaurant.restaurant_id ??
    restaurant.slug;
  const detailsPath = rid ? `/restaurant/${rid}` : undefined;

  return (
    <Card
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        boxShadow: "none",
        width: "100%",
        height: "100%",
        minHeight: 350,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        image={
          restaurant.image_url ||
          restaurant.image ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400"
        }
        alt={restaurant.name}
        sx={{
          height: 200,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <CardContent
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {/* Name + Rating */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.1rem",
              lineHeight: 1.3,
              flex: 1,
              mr: 1,
            }}
          >
            {restaurant.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
            <StarIcon sx={{ color: "#facc15", fontSize: 18 }} />
            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
              {restaurant.rating || "4.5"}
            </Typography>
          </Box>
        </Box>

        {/* Cuisine - max 2 lines so all cards stay same height */}
        <Typography
          sx={{
            color: "#666",
            fontSize: "0.85rem",
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.3,
            minHeight: 35,
            maxHeight: 35,
          }}
        >
          {restaurant.cuisine || "Multi-cuisine"}
        </Typography>

        {/* Delivery Time + Location */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TimeIcon sx={{ fontSize: 16, color: "#666" }} />
            <Typography sx={{ fontSize: "0.8rem", color: "#666" }}>
              {restaurant.delivery_time || "25-35 min"}
            </Typography>
          </Box>

          {restaurant.location && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationIcon sx={{ fontSize: 16, color: "#666" }} />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "#666",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 120,
                }}
              >
                {restaurant.location}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Open Badge */}
        {restaurant.is_open !== false && (
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#22c55e",
              fontWeight: 600,
              mb: 1.5,
            }}
          >
            Open Now
          </Typography>
        )}

        {/* Button always pinned to bottom */}
        <Box sx={{ mt: "auto", pt: 1 }}>
          <Button
            component={Link}
            to={detailsPath || "#"}
            disabled={!rid}
            fullWidth
            variant="contained"
            sx={{
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#22c55e",
              borderRadius: 2,
              "&:hover": { bgcolor: "#16a34a" },
            }}
          >
            View Menu
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;