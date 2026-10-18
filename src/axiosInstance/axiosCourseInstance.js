import axios from "axios";
import { attachAuthInterceptors } from "./authInterceptor";

const rawBackendUrl =
  import.meta.env.VITE_APP_BACKEND_URL ||
  import.meta.env.VITE_APP_API_URL ||
  "";
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

const axiosCourseInstance = axios.create({
  baseURL: `${BACKEND_URL}/courses`,
  withCredentials: true,
});

attachAuthInterceptors(axiosCourseInstance);

export default axiosCourseInstance;
