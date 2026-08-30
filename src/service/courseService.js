import axiosCourseInstance from '../axiosInstance/axiosCourseInstance';

export const getCourses = async () => {
  const response = await axiosCourseInstance.get('/');
  return response.data.data;
};
