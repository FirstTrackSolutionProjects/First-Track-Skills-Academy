import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const axiosAttendanceInstance = axios.create({
  baseURL: `${BACKEND_URL}/attendance`,
  withCredentials: true,
});

axiosAttendanceInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosAttendanceInstance;
