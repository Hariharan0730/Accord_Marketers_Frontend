import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {

    const requestUrl = error.config?.url || "";


    if (error.response?.status === 401 && !requestUrl.includes("/admin/login")) {
      localStorage.removeItem("token");
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);
export default API;