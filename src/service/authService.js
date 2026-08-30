import axiosAuthInstance from '../axiosInstance/axiosAuthInstance';

export const login = async (payload) => {
  const response = await axiosAuthInstance.post('/login', payload);
  return response.data.data;
};
