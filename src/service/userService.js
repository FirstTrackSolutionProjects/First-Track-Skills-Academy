import axiosUserInstance from '../axiosInstance/axiosUserInstance';

export const createStudent = async (payload) => {
  const response = await axiosUserInstance.post('/', payload);
  return response.data.data;
};

export const getUsers = async (_token, params = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );

  const response = await axiosUserInstance.get('/', {
    params: filteredParams,
  });
  return response.data.data;
};

export const updateUserStatus = async (userId, payload) => {
  const response = await axiosUserInstance.patch(`/${userId}/status`, payload);
  return response.data;
};

export const softDeleteUser = async (userId) => {
  const response = await axiosUserInstance.delete(`/${userId}`);
  return response.data;
};
