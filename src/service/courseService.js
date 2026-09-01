import axiosCourseInstance from '../axiosInstance/axiosCourseInstance';

export const getCourses = async () => {
  const response = await axiosCourseInstance.get('/');
  return response.data.data;
};

export const createCourse = async (payload) => {
  const response = await axiosCourseInstance.post('/', payload);
  return response.data.data;
};

export const getBatches = async () => {
  const response = await axiosCourseInstance.get('/batches');
  return response.data.data;
};

export const createBatch = async (payload) => {
  const response = await axiosCourseInstance.post('/batches', payload);
  return response.data.data;
};
