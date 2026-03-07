import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000/api";

const restaurantApi = axios.create({ 
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

restaurantApi.interceptors.request.use((config) => {
  // Don't add auth token to login/register/logout endpoints
  const publicEndpoints = ['/restaurant/auth/login/', '/restaurant/auth/register/', '/restaurant/auth/logout/'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
  
  if (!isPublicEndpoint) {
    const access = localStorage.getItem("restaurant_access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
  }
  return config;
});


export const clearRestaurantAuth = () => {
  localStorage.removeItem("restaurant_access");
  localStorage.removeItem("restaurant_refresh");
  localStorage.removeItem("restaurant_user");
  localStorage.removeItem("restaurant_data");
};

export const setRestaurantAuth = (tokens, user, restaurant) => {
  localStorage.setItem("restaurant_access", tokens.access);
  localStorage.setItem("restaurant_refresh", tokens.refresh);
  localStorage.setItem("restaurant_user", JSON.stringify(user));
  localStorage.setItem("restaurant_data", JSON.stringify(restaurant));
};

export const getRestaurantUser = () => {
  const user = localStorage.getItem("restaurant_user");
  return user ? JSON.parse(user) : null;
};

export const getRestaurantData = () => {
  const data = localStorage.getItem("restaurant_data");
  return data ? JSON.parse(data) : null;
};

export const isRestaurantLoggedIn = () => {
  return !!localStorage.getItem("restaurant_access");
};

export const restaurantLogin = async (username, password) => {
  try {
    const response = await restaurantApi.post("/restaurant/auth/login/", {
      username,
      password,
    });
    
    if (response.data.success) {
      setRestaurantAuth(
        response.data.tokens,
        response.data.user,
        response.data.restaurant
      );
    }
    
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    // Re-throw the error so the component can handle it
    throw error;
  }
};

export const restaurantRegister = async (formData) => {
  const response = await restaurantApi.post("/restaurant/auth/register/", formData);
  
  if (response.data.success) {
    setRestaurantAuth(
      response.data.tokens,
      response.data.user,
      response.data.restaurant
    );
  }
  
  return response.data;
};

export const restaurantLogout = async () => {
  try {
    const refresh = localStorage.getItem("restaurant_refresh");
    await restaurantApi.post("/restaurant/auth/logout/", { refresh });
  } catch (e) {
  }
  clearRestaurantAuth();
};

export const getProfile = async () => {
  const response = await restaurantApi.get("/restaurant/auth/profile/");
  return response.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await restaurantApi.post("/restaurant/auth/change-password/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  
  if (response.data.success && response.data.tokens) {
    localStorage.setItem("restaurant_access", response.data.tokens.access);
    localStorage.setItem("restaurant_refresh", response.data.tokens.refresh);
  }
  
  return response.data;
};

export default restaurantApi;