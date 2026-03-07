import axios from "axios";

export const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const adminAccess = localStorage.getItem("admin_access");
  const userAccess = localStorage.getItem("access");
  
  if (adminAccess) {
    config.headers.Authorization = `Bearer ${adminAccess}`;
  } else if (userAccess) {
    config.headers.Authorization = `Bearer ${userAccess}`;
  }
  
  return config;
});

let refreshingPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error?.response?.status === 401 && !original?._retry) {
      original._retry = true;

      const adminRefresh = localStorage.getItem("admin_refresh");
      const userRefresh = localStorage.getItem("refresh");
      
      const refresh = adminRefresh || userRefresh;
      const isAdmin = !!adminRefresh;

      if (!refresh) {
        if (isAdmin) {
          localStorage.removeItem("admin_access");
          localStorage.removeItem("admin_refresh");
          window.location.href = "/admin/login";
        } else {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        if (!refreshingPromise) {
          refreshingPromise = axios.post(`${BASE_URL}/auth/token/refresh/`, {
            refresh,
          });
        }
        const resp = await refreshingPromise;
        refreshingPromise = null;
        const newAccess = resp.data?.access;
        
        if (newAccess) {
          if (isAdmin) {
            localStorage.setItem("admin_access", newAccess);
            localStorage.setItem("admin_refresh", refresh);
          } else {
            localStorage.setItem("access", newAccess);
            localStorage.setItem("refresh", refresh);
          }
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        }
      } catch {
        refreshingPromise = null;
        if (isAdmin) {
          localStorage.removeItem("admin_access");
          localStorage.removeItem("admin_refresh");
          window.location.href = "/admin/login";
        } else {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;