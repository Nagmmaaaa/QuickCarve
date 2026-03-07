import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Container,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import {
  Add,
  Remove,
  ArrowBack,
  Search,
  ShoppingBag,
} from "@mui/icons-material";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/http";
import { useCart } from "../context/CartContext";

/* ---------- VegDot ---------- */
const VegDot = ({ veg }) => (
  <Box
    sx={{
      width: 13,
      height: 13,
      borderRadius: "3px",
      border: `2px solid ${veg ? "#22c55e" : "#ef4444"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <Box
      sx={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        bgcolor: veg ? "#22c55e" : "#ef4444",
      }}
    />
  </Box>
);

/* ---------- QtyControl — NO re-mount flicker ---------- */
const QtyControl = ({ qty, onAdd, onInc, onDec }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      border: "1.5px solid #22c55e",
      borderRadius: 2,
      overflow: "hidden",
      minWidth: 90,
      height: 36,
    }}
  >
    {qty === 0 ? (
      <Button
        onClick={onAdd}
        fullWidth
        disableRipple={false}
        sx={{
          color: "#22c55e",
          fontWeight: 700,
          fontSize: 13,
          height: "100%",
          minWidth: "unset",
          px: 0,
          "&:hover": { bgcolor: "#f0fdf4" },
        }}
      >
        ADD
      </Button>
    ) : (
      <>
        <IconButton
          size="small"
          onClick={onDec}
          sx={{
            borderRadius: 0,
            color: "#22c55e",
            width: 30,
            height: "100%",
            "&:hover": { bgcolor: "#f0fdf4" },
          }}
        >
          <Remove sx={{ fontSize: 16 }} />
        </IconButton>

        <Typography
          sx={{
            flex: 1,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 14,
            color: "#15803d",
            userSelect: "none",
          }}
        >
          {qty}
        </Typography>

        <IconButton
          size="small"
          onClick={onInc}
          sx={{
            borderRadius: 0,
            color: "#22c55e",
            width: 30,
            height: "100%",
            "&:hover": { bgcolor: "#f0fdf4" },
          }}
        >
          <Add sx={{ fontSize: 16 }} />
        </IconButton>
      </>
    )}
  </Box>
);

/* ---------- MenuItem Card ---------- */
const MenuItemCard = React.memo(({ item, qty, onAdd, onInc, onDec }) => (
  <Card
    elevation={0}
    sx={{
      border: "1px solid #e5e7eb",
      borderRadius: 3,
      transition: "box-shadow 0.2s",
      "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
    }}
  >
    <CardContent
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        py: "14px !important",
        px: 2,
      }}
    >
      {/* Left Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
          <VegDot veg={item.item_type === "veg"} />
          <Typography
            fontWeight={600}
            fontSize={15}
            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {item.name}
          </Typography>
        </Stack>

        {item.description && (
          <Typography
            fontSize={12}
            color="text.secondary"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 0.5,
            }}
          >
            {item.description}
          </Typography>
        )}

        <Typography fontWeight={700} fontSize={15} color="#15803d">
          ₹{item.price}
        </Typography>
      </Box>

      {/* Right: Image + Qty */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, flexShrink: 0 }}>
        {item.image && (
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            sx={{ width: 80, height: 70, borderRadius: 2, objectFit: "cover" }}
          />
        )}
        <QtyControl qty={qty} onAdd={onAdd} onInc={onInc} onDec={onDec} />
      </Box>
    </CardContent>
  </Card>
));

/* ---------- Main Page ---------- */
const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/restaurants/${id}/`),
      api.get(`/menu-items/?restaurant=${id}`),
    ])
      .then(([r, m]) => {
        setRestaurant(r.data);
        setMenu(m.data.results || m.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* Stable qty getter — avoids re-renders */
  const getQty = useCallback(
    (itemId) => cartItems.find((i) => i.id === itemId)?.quantity || 0,
    [cartItems]
  );

  const handleAdd = useCallback(
    (item) =>
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurant_id: restaurant?.id,
      }),
    [addToCart, restaurant]
  );

  const handleInc = useCallback(
    (item) => updateQuantity(item.id, getQty(item.id) + 1),
    [updateQuantity, getQty]
  );

  const handleDec = useCallback(
    (item) => {
      const q = getQty(item.id);
      if (q <= 1) removeFromCart(item.id);
      else updateQuantity(item.id, q - 1);
    },
    [updateQuantity, removeFromCart, getQty]
  );

  const filteredMenu = useMemo(() => {
    let items = [...menu];
    if (filter !== "all")
      items = items.filter((i) =>
        filter === "veg" ? i.item_type === "veg" : i.item_type !== "veg"
      );
    if (search)
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.description?.toLowerCase().includes(search.toLowerCase())
      );
    return items;
  }, [menu, search, filter]);

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.quantity * i.price, 0);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Typography color="text.secondary">Loading menu...</Typography>
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "#f0fdf4", minHeight: "100vh", pb: totalItems ? 12 : 4 }}>

      {/* Header */}
      <Box sx={{ bgcolor: "#22c55e", color: "#fff", py: 3, px: 2 }}>
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
            <IconButton onClick={() => navigate("/restaurants")} sx={{ color: "#fff", p: 0.5 }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
                {restaurant?.name}
              </Typography>
              {restaurant?.cuisine && (
                <Typography sx={{ fontSize: 13, opacity: 0.85 }}>
                  {restaurant.cuisine}
                </Typography>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>

        {/* Search & Filter */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3} alignItems={{ sm: "center" }}>
          <TextField
            fullWidth
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": { borderColor: "#22c55e" },
                "&.Mui-focused fieldset": { borderColor: "#22c55e" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#9ca3af", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={1} flexShrink={0}>
            {[
              { key: "all", label: "All" },
              { key: "veg", label: "🟢 Veg" },
              { key: "nonveg", label: "🔴 Non-Veg" },
            ].map(({ key, label }) => (
              <Chip
                key={key}
                label={label}
                clickable
                onClick={() => setFilter(key)}
                sx={{
                  bgcolor: filter === key ? "#22c55e" : "#fff",
                  color: filter === key ? "#fff" : "#374151",
                  border: "1px solid",
                  borderColor: filter === key ? "#22c55e" : "#e5e7eb",
                  fontWeight: filter === key ? 700 : 500,
                  fontSize: 13,
                  transition: "all 0.15s",
                }}
              />
            ))}
          </Stack>
        </Stack>

        {/* Results count */}
        <Typography sx={{ color: "#6b7280", fontSize: 13, mb: 2 }}>
          {filteredMenu.length} item{filteredMenu.length !== 1 ? "s" : ""} found
        </Typography>

        {/* Menu List */}
        {filteredMenu.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">No items match your search.</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {filteredMenu.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                qty={getQty(item.id)}
                onAdd={() => handleAdd(item)}
                onInc={() => handleInc(item)}
                onDec={() => handleDec(item)}
              />
            ))}
          </Stack>
        )}
      </Container>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "#fff",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Container maxWidth="lg">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ py: 1.5 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    bgcolor: "#22c55e",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingBag sx={{ color: "#fff", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography fontWeight={700} fontSize={14} lineHeight={1.2}>
                    {totalItems} item{totalItems !== 1 ? "s" : ""} · ₹{totalPrice.toFixed(2)}
                  </Typography>
                  <Typography fontSize={11} color="text.secondary">
                    Extra charges may apply
                  </Typography>
                </Box>
              </Stack>

              <Button
                component={Link}
                to="/cart"
                variant="contained"
                sx={{
                  bgcolor: "#22c55e",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  "&:hover": { bgcolor: "#16a34a" },
                }}
              >
                View Cart →
              </Button>
            </Stack>
          </Container>
        </Paper>
      )}
    </Box>
  );
};

export default RestaurantDetailsPage;
