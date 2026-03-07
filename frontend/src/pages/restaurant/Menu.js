import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import restaurantApi from "../../api/restaurantAuth";

const Menu = () => {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await restaurantApi.get("/restaurant/menu/");
      setMenuItems(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await restaurantApi.delete(`/restaurant/menu/${id}/delete/`);
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await restaurantApi.patch(`/restaurant/menu/${item.id}/`, {
        is_available: !item.is_available,
      });
      fetchMenu();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ padding: 20 }}>Loading menu...</p>;

  return (
    <div style={{ padding: 20, background: "#f0fdfa", minHeight: "100vh" }}>
      <h2 style={{ color: "#047857" }}>Menu Management</h2>
      <p style={{ color: "#555" }}>
        Manage your restaurant menu items
      </p>

      {/* ACTION BAR */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <button
          style={addBtn}
          onClick={() => navigate("/restaurant-panel/menu/add")}
        >
          + Add Item
        </button>
      </div>

      {/* TABLE */}
      {filteredMenu.length === 0 ? (
        <p>No menu items found.</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>No</th>
              <th style={th}>Item Name</th>
              <th style={th}>Price</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenu.map((item, index) => (
              <tr key={item.id}>
                <td style={td}>{index + 1}</td>
                <td style={td}>{item.name}</td>
                <td style={td}>₹{item.price}</td>
                <td style={td}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: item.is_available ? "#047857" : "#dc2626",
                    }}
                  >
                    {item.is_available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td style={td}>
                  <button
                    style={btn}
                    onClick={() =>
                      navigate(`/restaurant-panel/menu/edit/${item.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    style={btn}
                    onClick={() => toggleAvailability(item)}
                  >
                    {item.is_available ? "Hide" : "Show"}
                  </button>
                  <button
                    style={deleteBtn}
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ---------- STYLES (TEAL GREEN THEME) ---------- */

const table = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#ffffff",
};

const th = {
  border: "1px solid #e5e7eb",
  padding: 10,
  background: "#ccfbf1",
  color: "#065f46",
  textAlign: "left",
};

const td = {
  border: "1px solid #e5e7eb",
  padding: 10,
};

const inputStyle = {
  padding: 10,
  border: "1px solid #99f6e4",
  borderRadius: 6,
  width: 220,
  outline: "none",
};

const addBtn = {
  padding: "10px 16px",
  background: "#047857",
  color: "#ffffff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

const btn = {
  marginRight: 6,
  padding: "6px 10px",
  border: "1px solid #99f6e4",
  background: "#ecfeff",
  color: "#065f46",
  borderRadius: 4,
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 10px",
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

export default Menu;