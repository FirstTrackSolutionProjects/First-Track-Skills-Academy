import axiosEnrollmentInstance from '../axiosInstance/axiosEnrollmentInstance';

export const enrollCohort = async (payload) => {
  const response = await axiosEnrollmentInstance.post(
    '/cohort/enroll',
    payload
  );
  return response.data.data;
};

export const getMyEnrolledCourses = async () => {
  const response = await axiosEnrollmentInstance.get('/my-courses');
  return response.data.data;
};
