import axiosCollegeInstance from '../axiosInstance/axiosCollegeInstance';

export const createCollege = async (payload) => {
  const response = await axiosCollegeInstance.post('/', payload);
  return response.data.data;
};

export const verifyPartner = async (partnerCode) => {
  const response = await axiosCollegeInstance.get(`/partner/${partnerCode}`);
  return response.data.data;
};

export const getColleges = async (_token, status) => {
  const response = await axiosCollegeInstance.get('/', {
    params: status ? { status } : undefined,
  });
  return response.data.data;
};

export const updateCollegeStatus = async (collegeId, status) => {
  const response = await axiosCollegeInstance.patch(
    `/${collegeId}/update-status`,
    { status }
  );
  return response.data.data;
};

export const getCollegePartner = async () => {
  const response = await axiosCollegeInstance.get('/partner-link');
  return response.data.data;
};

export const getCollegeDashboard = async () => {
  const response = await axiosCollegeInstance.get('/dashboard');
  return response.data.data;
};

export const getSuperadminColleges = async () => {
  const response = await axiosCollegeInstance.get('/superadmin/colleges');
  return response.data.data;
};

export const getSuperadminStudents = async (_token, params = {}) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null)
  );

  const response = await axiosCollegeInstance.get('/superadmin/students', {
    params: filteredParams,
  });
  return response.data.data;
};
