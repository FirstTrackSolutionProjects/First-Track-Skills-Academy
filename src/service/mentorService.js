import axios from "axios";
import { attachAuthInterceptors } from "../axiosInstance/authInterceptor";

const rawBackendUrl =
  import.meta.env.VITE_APP_BACKEND_URL ||
  import.meta.env.VITE_APP_API_URL ||
  "";
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

const axiosMentorInstance = axios.create({
  baseURL: `${BACKEND_URL}/mentor`,
  withCredentials: true,
});

attachAuthInterceptors(axiosMentorInstance);

export const createMentor = async (payload) => {
  const response = await axiosMentorInstance.post("/", payload);
  return response.data.data;
};

export const getMentors = async (params = {}) => {
  const response = await axiosMentorInstance.get("/", {
    params,
  });
  return response.data.data;
};
