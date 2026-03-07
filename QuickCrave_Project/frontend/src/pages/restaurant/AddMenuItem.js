import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import restaurantApi from "../../api/restaurantAuth";

function AddMenuItem() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    isVeg: true,
    isAvailable: true,
  });

  useEffect(() => {
    restaurantApi.get("/categories/").then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price || !formData.category) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("item_type", formData.isVeg ? "veg" : "non-veg");
      data.append("is_available", formData.isAvailable);

      if (imageFile) {
        data.append("item_image", imageFile);
      }

      await restaurantApi.post("/restaurant/menu/create/", data);
      navigate("/restaurant-panel/menu");
    } catch {
      setError("Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Add Menu Item</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Item Name *</label><br />
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Category *</label><br />
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Price *</label><br />
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description</label><br />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="3"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Food Type</label><br />
          <select
            value={formData.isVeg}
            onChange={(e) =>
              setFormData({ ...formData, isVeg: e.target.value === "true" })
            }
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="true">Vegetarian</option>
            <option value="false">Non-Vegetarian</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Item Image</label><br />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>
    </div>
  );
}

export default AddMenuItem;