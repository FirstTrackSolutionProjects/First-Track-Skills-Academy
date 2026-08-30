import axiosEnrollmentInstance from '../axiosInstance/axiosEnrollmentInstance';

export const enrollCohort = async (payload) => {
  const response = await axiosEnrollmentInstance.post(
    '/cohort/enroll',
    payload
  );
  return response.data.data;
};
