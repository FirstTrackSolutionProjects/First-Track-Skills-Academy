import axiosAdminInstance from '../axiosInstance/axiosAdminInstance';

export const createAdmin = async (payload) => {
  const response = await axiosAdminInstance.post('/', payload);
  return response.data.data;
};
