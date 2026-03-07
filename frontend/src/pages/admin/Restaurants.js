import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Stack,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/http";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact_number: "",
    image: "",
  });

  const fetchRestaurants = async () => {
    try {
      const res = await api.get("/restaurants/");
      setRestaurants(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleOpen = (restaurant = null) => {
    if (restaurant) {
      setEditingId(restaurant.id);
      setFormData({
        name: restaurant.name || "",
        address: restaurant.address || "",
        contact_number: restaurant.contact_number || "",
        image: restaurant.image || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        address: "",
        contact_number: "",
        image: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.patch(`/restaurants/${editingId}/`, formData);
      } else {
        await api.post("/restaurants/", formData);
      }
      fetchRestaurants();
      handleClose();
    } catch {
      alert("Failed to save restaurant");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this restaurant?")) {
      try {
        await api.delete(`/restaurants/${id}/`);
        fetchRestaurants();
      } catch {
        alert("Delete failed");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* HEADER */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Restaurant Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all registered restaurants
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#166534",
              "&:hover": { bgcolor: "#14532d" },
            }}
            onClick={() => handleOpen()}
          >
            Add Restaurant
          </Button>
        </Box>
      </Paper>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Restaurant</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Contact</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {restaurants.length > 0 ? (
              restaurants.map((r) => (
                <TableRow
                  key={r.id}
                  hover
                  sx={{ transition: "0.2s" }}
                >
                  <TableCell>#{r.id}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={r.image || ""}>
                        {r.name?.[0]}
                      </Avatar>
                      <Typography fontWeight="500">
                        {r.name}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell>{r.address || "N/A"}</TableCell>
                  <TableCell>{r.contact_number || "N/A"}</TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => handleOpen(r)} color="success">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(r.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No restaurants found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold">
          {editingId ? "Edit Restaurant" : "Add Restaurant"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Restaurant Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={formData.address}
              onChange={handleChange}
            />
            <TextField
              label="Contact Number"
              name="contact_number"
              fullWidth
              value={formData.contact_number}
              onChange={handleChange}
            />
            <TextField
              label="Image URL"
              name="image"
              fullWidth
              value={formData.image}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: "#166534" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}