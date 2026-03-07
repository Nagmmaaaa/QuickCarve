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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/http";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    api
      .get("/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => alert("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  const openDialog = (category = null) => {
    if (category) {
      setEditId(category.id);
      setName(category.name);
    } else {
      setEditId(null);
      setName("");
    }
    setOpen(true);
  };

  const saveCategory = async () => {
    try {
      if (editId) {
        await api.put(`/categories/${editId}/`, { name });
      } else {
        await api.post("/categories/", { name });
      }

      const res = await api.get("/categories/");
      setCategories(res.data);
      setOpen(false);
    } catch {
      alert("Failed to save category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}/`);
      setCategories(categories.filter((c) => c.id !== id));
    } catch {
      alert("Failed to delete category");
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
              Category Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage food categories
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#166534",
              "&:hover": { bgcolor: "#14532d" },
            }}
            onClick={() => openDialog()}
          >
            Add Category
          </Button>
        </Box>
      </Paper>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell align="right"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow
                  key={cat.id}
                  hover
                  sx={{ transition: "0.2s" }}
                >
                  <TableCell>#{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="success"
                      onClick={() => openDialog(cat)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteCategory(cat.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight="bold">
          {editId ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#166534" }}
            onClick={saveCategory}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}