import React, { useEffect, useState } from "react";
import restaurantApi, { getRestaurantData } from "../../api/restaurantAuth";

const Settings = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "open",
    open_time: "09:00",
    close_time: "22:00",
  });

  useEffect(() => {
    const data = getRestaurantData();
    if (data?.id) {
      setRestaurantId(data.id);
      fetchSettings(data.id);
    }
  }, []);

  const fetchSettings = async (id) => {
    try {
      const res = await restaurantApi.get(`/restaurant/${id}/settings/`);
      setForm({
        name: res.data.name || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
        address: res.data.address || "",
        status: res.data.status || "open",
        open_time: res.data.open_time || "09:00",
        close_time: res.data.close_time || "22:00",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      await restaurantApi.put(`/restaurant/${restaurantId}/settings/`, form);
      setMessage("Settings saved successfully ✅");
    } catch (err) {
      setMessage("Failed to save settings ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div style={container}>
      <h2>Restaurant Settings</h2>
      <p>Update your restaurant details</p>

      {message && <p>{message}</p>}

      <div style={box}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} />

        <label>Status</label>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <label>Opening Time</label>
        <input type="time" name="open_time" value={form.open_time} onChange={handleChange} />

        <label>Closing Time</label>
        <input type="time" name="close_time" value={form.close_time} onChange={handleChange} />

        <button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

/* ---- Simple styles ---- */
const container = {
  padding: 20,
  maxWidth: 600,
};

const box = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

export default Settings;