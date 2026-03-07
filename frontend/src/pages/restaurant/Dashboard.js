import React, { useEffect, useState } from "react";
import restaurantApi, { getRestaurantData } from "../../api/restaurantAuth";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    const restaurant = getRestaurantData();
    if (restaurant?.id) {
      setRestaurantId(restaurant.id);
    }
  }, []);

  useEffect(() => {
    if (restaurantId) {
      fetchOrders();
    }
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await restaurantApi.get(`/orders/?restaurant=${restaurantId}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    cancelled: orders.filter(o => o.status === "Cancelled").length,
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Restaurant Dashboard</h2>
      <p>Overview of your restaurant orders</p>

      {/* STAT CARDS */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <StatCard title="Total Orders" value={stats.total} />
        <StatCard title="Pending Orders" value={stats.pending} />
        <StatCard title="Delivered Orders" value={stats.delivered} />
        <StatCard title="Cancelled Orders" value={stats.cancelled} />
      </div>

      {/* ORDERS TABLE */}
      <h3>Recent Orders</h3>

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 10,
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={th}>Order ID</th>
              <th style={th}>Customer</th>
              <th style={th}>Amount</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map(order => (
              <tr key={order.id}>
                <td style={td}>#{order.id}</td>
                <td style={td}>{order.customer_name || "Customer"}</td>
                <td style={td}>₹{order.total_price || 0}</td>
                <td style={td}>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* SIMPLE COMPONENTS */
const StatCard = ({ title, value }) => (
  <div
    style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      padding: 16,
      minWidth: 150,
    }}
  >
    <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>{title}</p>
    <h3 style={{ marginTop: 8 }}>{value}</h3>
  </div>
);

const th = {
  padding: 10,
  border: "1px solid #e5e7eb",
  textAlign: "left",
};

const td = {
  padding: 10,
  border: "1px solid #e5e7eb",
};

export default Dashboard;