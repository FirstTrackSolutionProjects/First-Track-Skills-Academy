import axios from "axios";

const rawBackendUrl = import.meta.env.VITE_APP_BACKEND_URL || import.meta.env.VITE_APP_API_URL || "";
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

const axiosPaymentInstance = axios.create({
  baseURL: `${BACKEND_URL}/payments`,
  withCredentials: true,
});

axiosPaymentInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosPaymentInstance;
