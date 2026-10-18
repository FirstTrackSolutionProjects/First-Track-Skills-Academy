import axiosAuthInstance from '../axiosInstance/axiosAuthInstance';
import { storeActions } from '../store/useStore';

export const login = async (payload) => {
  const response = await axiosAuthInstance.post('/login', payload);
  return response.data.data;
};

export const refreshTokenApi = async (refreshToken) => {
  const response = await axiosAuthInstance.post('/refresh-token', {
    refresh_token: refreshToken,
  });
  return response.data.data;
};

export const logoutUser = async () => {
  const refreshToken = storeActions.getRefreshToken();
  try {
    if (refreshToken) {
      await axiosAuthInstance.post('/logout', { refresh_token: refreshToken });
    }
  } catch (err) {
    console.warn("Server logout notification failed:", err);
  } finally {
    storeActions.clearAuth();
  }
};

export const forgotPassword = async (payload) => {
  const response = await axiosAuthInstance.post('/forgot-password', payload);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await axiosAuthInstance.post('/reset-password', payload);
  return response.data;
};