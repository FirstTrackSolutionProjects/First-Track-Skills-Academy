import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const axiosCourseInstance = axios.create({
  baseURL: `${BACKEND_URL}/courses`,
  withCredentials: true,
});

axiosCourseInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default axiosCourseInstance;
