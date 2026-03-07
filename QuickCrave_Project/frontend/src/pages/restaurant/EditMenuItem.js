import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import restaurantApi from "../../api/restaurantAuth";

const styles = {
  root: {
    background: "#f3f4f6",
    padding: "16px 20px 20px",
    minHeight: "100vh",
    boxSizing: "border-box",
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "transparent",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#111827",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "4px",
  },
  formContainer: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  formSection: {
    marginBottom: "28px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e5e7eb",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
  },
  formRequired: {
    color: "#dc2626",
  },
  formInput: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  formTextarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: "100px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  formSelect: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    background: "#ffffff",
    cursor: "pointer",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  formHelper: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "6px",
  },
  toggleGroup: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  toggleOption: {
    flex: 1,
    minWidth: "120px",
    padding: "14px 20px",
    borderRadius: "10px",
    border: "2px solid #e5e7eb",
    background: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: 500,
    textAlign: "center",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  toggleOptionActiveGreen: {
    background: "#ecfdf5",
    borderColor: "#16a34a",
    color: "#166534",
  },
  toggleOptionActiveRed: {
    background: "#fef2f2",
    borderColor: "#dc2626",
    color: "#dc2626",
  },
  toggleOptionActiveBlue: {
    background: "#eff6ff",
    borderColor: "#2563eb",
    color: "#1d4ed8",
  },
  toggleOptionActiveGray: {
    background: "#f3f4f6",
    borderColor: "#6b7280",
    color: "#374151",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  },
  btnCancel: {
    padding: "12px 24px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#ffffff",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    color: "#374151",
    transition: "all 0.2s",
  },
  btnSave: {
    padding: "12px 32px",
    border: "none",
    borderRadius: "10px",
    background: "#16a34a",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    color: "#ffffff",
    transition: "all 0.2s",
  },
  btnSaveDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  errorMsg: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "14px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  successMsg: {
    background: "#ecfdf5",
    color: "#166534",
    padding: "14px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
    flexDirection: "column",
    gap: "12px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #16a34a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  addCategoryInline: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
  },
  addCategoryBtn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    color: "#ffffff",
  },
  newCategoryLink: {
    fontSize: "12px",
    color: "#2563eb",
    cursor: "pointer",
    marginTop: "8px",
    display: "inline-block",
  },
};

const EditMenuItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    description: "",
    isVeg: true,
    isAvailable: true,
  });

  useEffect(() => {
    fetchCategories();
    fetchMenuItem();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await restaurantApi.get("/restaurant/categories/");
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setCategories(data);
    } catch (err) {
      console.error("Categories Error:", err);
    }
  };

  const fetchMenuItem = async () => {
    try {
      const res = await restaurantApi.get(`/restaurant/menu/${id}/`);
      const item = res.data;
      setFormData({
        name: item.name || "",
        category: item.category || "",
        price: String(item.price || ""),
        originalPrice: item.original_price ? String(item.original_price) : "",
        description: item.description || "",
        isVeg: item.item_type === "veg",
        isAvailable: item.is_available,
      });
    } catch (err) {
      setError("Failed to load menu item");
      console.error("Fetch Item Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceInput = (value, field) => {
    if (value === "") {
      setFormData({ ...formData, [field]: "" });
      return;
    }

    if (/^\d{0,4}(\.\d{0,2})?$/.test(value)) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    try {
      const res = await restaurantApi.post("/restaurant/categories/create/", {
        name: newCategoryName.trim(),
      });
      await fetchCategories();
      setFormData({ ...formData, category: res.data.id });
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Item name is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Valid price is required");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        description: formData.description.trim(),
        item_type: formData.isVeg ? "veg" : "non-veg",
        is_available: formData.isAvailable,
      };

      await restaurantApi.put(`/restaurant/menu/${id}/`, payload);
      setSuccess("Menu item updated successfully!");

      setTimeout(() => {
        navigate("/restaurant-panel/menu");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.root}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner} />
          <p>Loading menu item...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <div>
          <button style={styles.backBtn} onClick={() => navigate("/restaurant-panel/menu")}>
            ← Back to Menu
          </button>
          <h1 style={styles.headerTitle}>Edit Menu Item</h1>
          <p style={styles.headerSubtitle}>Update the details of your menu item</p>
        </div>
      </header>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={styles.errorMsg}>
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div style={styles.successMsg}>
              <span>✅</span> {success}
            </div>
          )}

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>📝 Basic Information</h3>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Item Name <span style={styles.formRequired}>*</span>
              </label>
              <input
                type="text"
                style={styles.formInput}
                placeholder="e.g., Butter Chicken, Paneer Tikka"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Description</label>
              <textarea
                style={styles.formTextarea}
                placeholder="Describe your dish - ingredients, taste, preparation style..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p style={styles.formHelper}>A good description helps customers understand your dish better</p>
            </div>
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>📂 Category</h3>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Select Category <span style={styles.formRequired}>*</span>
              </label>
              <select
                style={styles.formSelect}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Choose a category</option>
                {categories.map((cat, index) => (
                  <option key={`edit-cat-${cat.id}-${index}`} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {!showNewCategory ? (
                <span style={styles.newCategoryLink} onClick={() => setShowNewCategory(true)}>
                  + Add New Category
                </span>
              ) : (
                <div style={styles.addCategoryInline}>
                  <input
                    type="text"
                    style={{ ...styles.formInput, flex: 1 }}
                    placeholder="New category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCategory())}
                  />
                  <button type="button" style={styles.addCategoryBtn} onClick={handleAddCategory}>
                    Add
                  </button>
                  <button
                    type="button"
                    style={styles.btnCancel}
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>💰 Pricing</h3>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  Selling Price (₹) <span style={styles.formRequired}>*</span>
                </label>
                <input
                  type="text"
                  style={styles.formInput}
                  placeholder="299"
                  value={formData.price}
                  onChange={(e) => handlePriceInput(e.target.value, "price")}
                />
                <p style={styles.formHelper}>The price customers will pay</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Original Price (₹)</label>
                <input
                  type="text"
                  style={styles.formInput}
                  placeholder="399"
                  value={formData.originalPrice}
                  onChange={(e) => handlePriceInput(e.target.value, "originalPrice")}
                />
                <p style={styles.formHelper}>Optional - Shows as strikethrough for discounts</p>
              </div>
            </div>
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>🍽️ Food Type</h3>

            <div style={styles.toggleGroup}>
              <button
                type="button"
                style={{
                  ...styles.toggleOption,
                  ...(formData.isVeg ? styles.toggleOptionActiveGreen : {}),
                }}
                onClick={() => setFormData({ ...formData, isVeg: true })}
              >
                🟢 Vegetarian
              </button>
              <button
                type="button"
                style={{
                  ...styles.toggleOption,
                  ...(!formData.isVeg ? styles.toggleOptionActiveRed : {}),
                }}
                onClick={() => setFormData({ ...formData, isVeg: false })}
              >
                🔴 Non-Vegetarian
              </button>
            </div>
          </div>

          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>📦 Availability</h3>

            <div style={styles.toggleGroup}>
              <button
                type="button"
                style={{
                  ...styles.toggleOption,
                  ...(formData.isAvailable ? styles.toggleOptionActiveBlue : {}),
                }}
                onClick={() => setFormData({ ...formData, isAvailable: true })}
              >
                ✅ Available Now
              </button>
              <button
                type="button"
                style={{
                  ...styles.toggleOption,
                  ...(!formData.isAvailable ? styles.toggleOptionActiveGray : {}),
                }}
                onClick={() => setFormData({ ...formData, isAvailable: false })}
              >
                ⏸️ Currently Unavailable
              </button>
            </div>
            <p style={styles.formHelper}>You can change availability anytime from the menu page</p>
          </div>

          <div style={styles.formActions}>
            <button type="button" style={styles.btnCancel} onClick={() => navigate("/restaurant-panel/menu")}>
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.btnSave,
                ...(saving ? styles.btnSaveDisabled : {}),
              }}
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Menu Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItem;