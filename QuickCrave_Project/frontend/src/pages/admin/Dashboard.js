import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '../../api/http';

//  Stat Card 
function StatCard({ title, value, icon, accent }) {
  return (
    <Box
      sx={{
        bgcolor: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
      }}
    >
      {/* Icon badge */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: `${accent}18`,   
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent,
        }}
      >
        {icon}
      </Box>

      {/* Numbers */}
      <Box>
        <Typography fontSize={13} color="#888" fontWeight={600} mb={0.5}>
          {title}
        </Typography>
        <Typography fontSize={26} fontWeight={800} color="#111" lineHeight={1}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

// Dashboard 
export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.allSettled([
        api.get('/orders/'),
        api.get('/menu-items/'),
        api.get('/users/'),
      ]);

      const orders   = ordersRes.status   === 'fulfilled' ? ordersRes.value.data   : [];
      const products = productsRes.status === 'fulfilled' ? productsRes.value.data : [];
      const users    = usersRes.status    === 'fulfilled' ? usersRes.value.data    : [];

      const totalRevenue = orders.reduce(
        (sum, order) => sum + (parseFloat(order.total_price || order.total) || 0),
        0
      );

      setStats({
        revenue: totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: users.length,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#f97316' }} />
      </Box>
    );
  }

  //  Card config 
  const cards = [
    {
      title:  'Total Revenue',
      value:  `₹${stats.revenue.toFixed(2)}`,
      icon:   <AttachMoneyIcon fontSize="small" />,
      accent: '#22c55e',  
    },
    {
      title:  'Total Orders',
      value:  stats.totalOrders,
      icon:   <ShoppingBagIcon fontSize="small" />,
      accent: '#3b82f6',   
    },
    {
      title:  'Customers',
      value:  stats.totalCustomers,
      icon:   <PeopleIcon fontSize="small" />,
      accent: '#a855f7',   
    },
    {
      title:  'Menu Items',
      value:  stats.totalProducts,
      icon:   <FastfoodIcon fontSize="small" />,
      accent: '#f97316',  
    },
  ];

  //  Render
  return (
    <Box>
      {/* Page heading */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUpIcon sx={{ color: '#f97316', fontSize: 26 }} />
        <Typography variant="h5" fontWeight={800} color="#111">
          Dashboard Overview
        </Typography>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card.title} item xs={12} sm={6} md={3}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
