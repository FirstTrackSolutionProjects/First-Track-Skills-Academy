import axios from "axios";
import { storeActions } from "../store/useStore";

const rawBackendUrl =
  import.meta.env.VITE_APP_BACKEND_URL ||
  import.meta.env.VITE_APP_API_URL ||
  "";
const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const attachAuthInterceptors = (axiosInstance) => {
  // 1. Request Interceptor: Inject latest access token from store
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = storeActions.getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 2. Response Interceptor: Seamlessly refresh expired access token with token rotation
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only attempt refresh on 401 Unauthorized errors
      if (!error.response || error.response.status !== 401) {
        return Promise.reject(error);
      }

      // Do not attempt to refresh if the failed request was already a retry or was an auth endpoint
      if (
        !originalRequest ||
        originalRequest._retry ||
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/refresh-token") ||
        originalRequest.url?.includes("/refresh")
      ) {
        return Promise.reject(error);
      }

      const refreshToken = storeActions.getRefreshToken();
      if (!refreshToken) {
        storeActions.clearAuth();
        return Promise.reject(error);
      }

      // If a token refresh is already pending, queue this request until the new token arrives
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Execute refresh token rotation via direct un-intercepted axios call
        const response = await axios.post(
          `${BACKEND_URL}/auth/refresh-token`,
          { refresh_token: refreshToken },
          { withCredentials: true }
        );

        const newTokens = response.data?.data;
        const newAccessToken = newTokens?.access_token;
        const newRefreshToken = newTokens?.refresh_token;

        if (!newAccessToken) {
          throw new Error("Invalid response from refresh token endpoint");
        }

        // Rotate and persist both access token and new rotated refresh token
        storeActions.updateTokens(newAccessToken, newRefreshToken);

        // Update authorization header for the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Unblock all queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        // Refresh token failed or expired -> reject queue and clear session
        processQueue(refreshErr, null);
        storeActions.clearAuth();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
  );
};
