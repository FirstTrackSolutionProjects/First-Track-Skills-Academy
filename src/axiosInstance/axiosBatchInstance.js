import axios from "axios";
import { attachAuthInterceptors } from "./authInterceptor";

const rawBackendUrl =
  import.meta.env.VITE_APP_BACKEND_URL ||
  import.meta.env.VITE_APP_API_URL ||
  "";
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

const axiosBatchInstance = axios.create({
  baseURL: `${BACKEND_URL}/batches`,
  withCredentials: true,
});

attachAuthInterceptors(axiosBatchInstance);

export default axiosBatchInstance;
