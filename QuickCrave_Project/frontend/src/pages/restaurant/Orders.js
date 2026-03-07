import React, { useEffect, useState } from "react";
import restaurantApi, { getRestaurantData } from "../../api/restaurantAuth";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    const data = getRestaurantData();
    if (data?.id) setRestaurantId(data.id);
  }, []);

  useEffect(() => {
    if (restaurantId) fetchOrders();
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

  const updateStatus = async (id, status) => {
    try {
      await restaurantApi.patch(`/orders/${id}/`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Orders Management</h2>
      <p>View and manage customer orders</p>

      <button style={refreshBtn} onClick={fetchOrders}>
        🔄 Refresh
      </button>

      {orders.length === 0 ? (
        <p style={{ marginTop: 20 }}>No orders found.</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Order ID</th>
              <th style={th}>Customer</th>
              <th style={th}>Total</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={td}>#{order.id}</td>
                <td style={td}>
                  {order.customer_name || "Customer"}
                </td>
                <td style={td}>₹{order.total_amount || order.order_total || 0}</td>
                <td style={td}>{order.status}</td>
                <td style={td}>
                  {order.status === "Pending" && (
                    <>
                      <button
                        style={acceptBtn}
                        onClick={() => updateStatus(order.id, "Confirmed")}
                      >
                        Accept
                      </button>
                      <button
                        style={rejectBtn}
                        onClick={() => updateStatus(order.id, "Cancelled")}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {["Confirmed", "Preparing", "Ready"].includes(order.status) && (
                    <button
                      style={nextBtn}
                      onClick={() =>
                        updateStatus(
                          order.id,
                          order.status === "Confirmed"
                            ? "Preparing"
                            : order.status === "Preparing"
                            ? "Ready"
                            : "Delivered"
                        )
                      }
                    >
                      Next
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* -------- STYLES -------- */

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 20,
};

const th = {
  border: "1px solid #e5e7eb",
  padding: 10,
  background: "#f3f4f6",
  textAlign: "left",
};

const td = {
  border: "1px solid #e5e7eb",
  padding: 10,
};

const refreshBtn = {
  padding: "8px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const acceptBtn = {
  padding: "6px 10px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  marginRight: 6,
  cursor: "pointer",
};

const rejectBtn = {
  padding: "6px 10px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  marginRight: 6,
  cursor: "pointer",
};

const nextBtn = {
  padding: "6px 10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

export default Orders;