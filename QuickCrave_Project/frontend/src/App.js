import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

/* Layout */
import Navbar from './components/Navbar';
import Footer from './components/Footer';

/* User Pages */
import LandingPage from './pages/LandingPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQPage from './pages/FAQPage';
import ProfilePage from './pages/ProfilePage';

import RestaurantLayout from "./pages/restaurant/RestaurantLayout";
import RestaurantProtectedRoute from "./utils/RestaurantProtectedRoute";

// Restaurant Pages
import RestaurantDashboard from "./pages/restaurant/Dashboard";
import RestaurantOrders from "./pages/restaurant/Orders";
import RestaurantMenu from "./pages/restaurant/Menu";
import RestaurantSettings from "./pages/restaurant/Settings";
import RestaurantLogin from "./pages/restaurant/Login";
import RestaurantRegister from "./pages/restaurant/Register";
import AddMenuItem from "./pages/restaurant/AddMenuItem";
import EditMenuItem from "./pages/restaurant/EditMenuItem";

/* Utils */
import ProtectedRoute from './utils/ProtectedRoute';

/* Admin Pages */
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminRestaurants from './pages/admin/Restaurants';
import AdminCategories from './pages/admin/Categories';
import AdminRestaurantPartners from './pages/admin/RestaurantPartners';

function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith('/restaurant/') ||
    location.pathname.startsWith('/restaurant-panel') ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/checkout' ||
    location.pathname === '/order-success' ||
    location.pathname === '/faq' ||
    location.pathname === '/contact' ||
    location.pathname === '/cart'||
    location.pathname === '/restaurants';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideLayout && <Navbar />}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            {/* User Management */}
            <Route path="restaurant-partners" element={<AdminRestaurantPartners />} />

            {/* Restaurant Management */}
            <Route path="restaurants" element={<AdminRestaurants />} />
            <Route path="categories" element={<AdminCategories />} />

            {/* Order Management */}
            <Route path="orders" element={<AdminOrders />} />


          </Route>

          {/* Restaurant Auth */}
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/restaurant/register" element={<RestaurantRegister />} />

          {/* Restaurant Panel */}
          <Route
            path="/restaurant-panel"
            element={
              <RestaurantProtectedRoute>
                <RestaurantLayout />
              </RestaurantProtectedRoute>
            }
          >
            <Route index element={<RestaurantDashboard />} />
            <Route path="dashboard" element={<RestaurantDashboard />} />
            <Route path="menu" element={<RestaurantMenu />} />
            <Route path="menu/add" element={<AddMenuItem />} />
            <Route path="menu/edit/:id" element={<EditMenuItem />} />
            <Route path="orders" element={<RestaurantOrders />} />
            <Route path="settings" element={<RestaurantSettings />} />
          </Route>

        </Routes>
      </Box>

      {!hideLayout && <Footer />}
    </Box>
  );
}

export default App;