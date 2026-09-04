import axiosAuthInstance from '../axiosInstance/axiosAuthInstance';

export const login = async (payload) => {
  const response = await axiosAuthInstance.post('/login', payload);
  return response.data.data;
};

export const forgotPassword = async (payload) => {
  const response = await axiosAuthInstance.post('/forgot-password', payload);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await axiosAuthInstance.post('/reset-password', payload);
  return response.data;
};