const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:3000";

const parseResponse = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data;
};

export const apiRequest = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return parseResponse(response);
};

export const login = (payload) =>
  apiRequest("/auth/login", { method: "POST", body: payload });

export const createCollege = (payload) =>
  apiRequest("/college-profile", { method: "POST", body: payload });

export const createAdmin = (payload) =>
  apiRequest("/admin", { method: "POST", body: payload });

export const createStudent = (payload) =>
  apiRequest("/users", { method: "POST", body: payload });

export const verifyPartner = (partnerCode) =>
  apiRequest(`/college-profile/partner/${partnerCode}`);

export const getCourses = (token) => apiRequest("/courses", { token });

export const getUsers = (token, params = {}) => {
  const query = new URLSearchParams(params);
  return apiRequest(`/users${query.toString() ? `?${query.toString()}` : ""}`, { token });
};

export const enrollCohort = (payload, token) =>
  apiRequest("/enrollment/cohort/enroll", {
    method: "POST",
    body: payload,
    token,
  });

export const getColleges = (token, status) =>
  apiRequest(status ? `/college-profile?status=${status}` : "/college-profile", { token });

export const updateCollegeStatus = (collegeId, status, token) =>
  apiRequest(`/college-profile/${collegeId}/update-status`, {
    method: "PATCH",
    body: { status },
    token,
  });

export const getCollegePartner = (token) =>
  apiRequest("/college-profile/partner-link", { token });

export const getCollegeDashboard = (token) =>
  apiRequest("/college-profile/dashboard", { token });

export const getSuperadminColleges = (token) =>
  apiRequest("/college-profile/superadmin/colleges", { token });

export const getSuperadminStudents = (token, params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== "" && value !== undefined && value !== null)
  );
  return apiRequest(`/college-profile/superadmin/students${query.toString() ? `?${query.toString()}` : ""}`, { token });
};
