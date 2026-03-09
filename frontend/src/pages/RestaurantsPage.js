// src/pages/RestaurantsPage.js
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Container,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/http";
import RestaurantCard from "../components/RestaurantCard";

const norm = (s) => (s ?? "").toString().toLowerCase().trim();

// Skeleton Card 
const SkeletonCard = () => (
  <Card
    sx={{
      borderRadius: 2,
      overflow: "hidden",
      border: "1px solid #e0e0e0",
      boxShadow: "none",
      width: "100%",
    }}
  >
    <Skeleton variant="rectangular" height={200} />
    <CardContent sx={{ p: 2.5 }}>
      <Skeleton width="70%" height={28} sx={{ mb: 1 }} />
      <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
      <Skeleton width="60%" height={20} sx={{ mb: 2 }} />
      <Skeleton height={44} sx={{ borderRadius: 2 }} />
    </CardContent>
  </Card>
);

//  Main Page 
const RestaurantsPage = () => {
  // sample restaurants to show when the backend is empty or for quick demos
  const sampleRestaurants = [
    {
      id: 1,
      name: "Pizza Palace",
      cuisine: "Italian",
      rating: "4.2",
      delivery_time: "20-30 min",
      location: "Downtown",
      image_url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400",
    },
    {
      id: 2,
      name: "Sushi Central",
      cuisine: "Japanese",
      rating: "4.8",
      delivery_time: "30-45 min",
      location: "Uptown",
      image_url: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400",
    },
    {
      id: 3,
      name: "Curry Corner",
      cuisine: "Indian",
      rating: "4.5",
      delivery_time: "25-35 min",
      location: "Midtown",
      image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
    },
    {
      id: 4,
      name: "Burger Barn",
      cuisine: "American",
      rating: "4.0",
      delivery_time: "15-25 min",
      location: "Suburbs",
      image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    },
    {
      id: 5,
      name: "Taco Town",
      cuisine: "Mexican",
      rating: "4.3",
      delivery_time: "20-30 min",
      location: "Old Town",
      image_url: "https://images.unsplash.com/photo-1617196035675-0ecad0fd87bb?w=400",
    },
  ];

  const [restaurants, setRestaurants] = useState(sampleRestaurants);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const q = norm(searchParams.get("search") || "");

  // Fetch restaurants from backend
  useEffect(() => {
    setLoading(true);
    api
      .get("/restaurants/")
      .then((response) => {
        const data = response.data;
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data && Array.isArray(data.results)) {
          list = data.results;
        }

        if (list.length > 0) {
          setRestaurants(list);
        } else {
          console.warn(
            "Backend returned no restaurants, keeping sample data"
          );
          // keep the initial sampleRestaurants already in state
        }
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        // don't wipe out the sample data on error
      })
      .finally(() => setLoading(false));
  }, []);

  // Build cuisine list from data
  const cuisines = useMemo(() => {
    const set = new Set(["All"]);
    restaurants.forEach((r) => {
      if (r.cuisine) set.add(r.cuisine);
    });
    return Array.from(set);
  }, [restaurants]);

  // Filter by search + cuisine
  const filtered = useMemo(() => {
    let result = restaurants;

    if (q) {
      result = result.filter((r) => {
        const haystack = [
          r.name,
          r.cuisine,
          r.description,
          r.location,
          ...(r.tags || []),
          ...(r.categories || []),
        ]
          .filter(Boolean)
          .map(norm)
          .join(" ");
        return haystack.includes(q);
      });
    }

    if (selectedCuisine !== "All") {
      result = result.filter((r) => r.cuisine === selectedCuisine);
    }

    return result;
  }, [restaurants, q, selectedCuisine]);

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) setSearchParams({ search: value });
    else setSearchParams({});
  };

  const clearSearch = () => {
    setSearchParams({});
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 0 } }}>

        {/* Page Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              mb: 1,
            }}
          >
            Discover Restaurants
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "1rem" }}>
            Find the best food near you
          </Typography>
        </Box>

        {/* Search + Dropdown Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            maxWidth: 900,
            mx: "auto",
            mb: 4,
            alignItems: { xs: "stretch", sm: "center" },
            px: { xs: 0, sm: 2 },
          }}
        >
          {/* Search Bar */}
          <TextField
            value={q}
            onChange={handleSearch}
            placeholder="Search restaurants, cuisines..."
            fullWidth
            size="small"
            aria-label="Search restaurants"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
              endAdornment: q && (
                <InputAdornment position="end">
                  <ClearIcon
                    sx={{ fontSize: 18, color: "#666", cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSearch();
                    }}
                  />
                </InputAdornment>
              ),
              sx: {
                height: 48,
                px: 0,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#fff",
                height: 48,
                alignItems: "center",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#22c55e",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#22c55e",
                  borderWidth: "1px",
                },
              },
              "& .MuiOutlinedInput-input": {
                color: "#333",
                padding: "10px 12px",
              },
            }}
          />

          {/* Cuisine Dropdown */}
          <TextField
            select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            label="Cuisine"
            size="small"
            aria-label="Filter by cuisine"
            SelectProps={{ native: true }}
            sx={{
              minWidth: 180,
              bgcolor: "#fff",
              height: 48,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                height: 48,
                display: "flex",
                alignItems: "center",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#22c55e",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#22c55e",
                  borderWidth: "1px",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#22c55e",
              },
            }}
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </TextField>
        </Box>

        {/* Loading Skeletons */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i} sx={{ display: "flex" }}>
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>

          /* No Results */
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <RestaurantIcon sx={{ fontSize: 64, color: "#22c55e", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              No restaurants found
            </Typography>
            <Typography sx={{ color: "#666", mb: 3 }}>
              {q ? `No results for "${q}"` : "Try a different filter"}
            </Typography>
            <Button
              onClick={() => {
                clearSearch();
                setSelectedCuisine("All");
              }}
              sx={{ textTransform: "none", color: "#22c55e", fontWeight: 600 }}
            >
              Clear filters
            </Button>
          </Box>

          /* Restaurant Grid */
        ) : (
          <>
            <Typography sx={{ color: "#666", mb: 3, fontSize: "0.9rem", maxWidth: 900, mx: "auto", pl: { xs: 0, sm: '12px' } }}>
              {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} found
            </Typography>

            <Grid container spacing={3} sx={{ maxWidth: 1100, mx: "auto" }} justifyContent="center">
              {filtered.map((restaurant, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={restaurant.id || restaurant.name || idx}
                  sx={{
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default RestaurantsPage;