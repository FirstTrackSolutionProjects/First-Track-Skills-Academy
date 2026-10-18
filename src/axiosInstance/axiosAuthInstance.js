import axios from "axios";
import { attachAuthInterceptors } from "./authInterceptor";

const rawBackendUrl =
  import.meta.env.VITE_APP_BACKEND_URL ||
  import.meta.env.VITE_APP_API_URL ||
  "";
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

const axiosAuthInstance = axios.create({
  baseURL: `${BACKEND_URL}/auth`,
  withCredentials: true,
});

attachAuthInterceptors(axiosAuthInstance);

export default axiosAuthInstance;
