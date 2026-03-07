import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from "@mui/material";
import api from "../../api/http";

export default function RestaurantPartners() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants/");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];

        // Only restaurants having owners
        const partners = data.filter((r) => r.owner !== null);
        setRestaurants(partners);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Restaurant Partners
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Cuisine</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Rating</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {restaurants.length > 0 ? (
              restaurants.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>#{r.id}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.email || "N/A"}</TableCell>
                  <TableCell>{r.cuisine || "Multi-Cuisine"}</TableCell>
                  <TableCell>
                    <Chip
                      label={r.status === "open" ? "Open" : "Closed"}
                      color={r.status === "open" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>⭐ {r.rating || "0.0"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No restaurant partners found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}