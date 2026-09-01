import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const axiosMentorInstance = axios.create({
  baseURL: `${BACKEND_URL}/mentor`,
  withCredentials: true,
});

axiosMentorInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export const createMentor = async (payload) => {
  const response = await axiosMentorInstance.post("/", payload);
  return response.data.data;
};
