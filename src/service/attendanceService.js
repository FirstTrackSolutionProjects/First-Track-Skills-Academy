import axiosAttendanceInstance from "../axiosInstance/axiosAttendanceInstance";

const extractError = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

export const markAttendance = async (payload) => {
  try {
    const res = await axiosAttendanceInstance.post("/mark", payload);
    return res.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to save attendance"));
  }
};

export const getBatchAttendance = async (batchId, date) => {
  try {
    const params = date ? { date } : {};
    const res = await axiosAttendanceInstance.get(`/batches/${batchId}`, { params });
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load batch attendance"));
  }
};

export const getAttendanceSessions = async (params = {}) => {
  try {
    const res = await axiosAttendanceInstance.get("/sessions", { params });
    return res.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load attendance sessions"));
  }
};

export const getCollegeAttendance = async (params = {}) => {
  try {
    const res = await axiosAttendanceInstance.get("/college", { params });
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load college attendance"));
  }
};

export const getMyAttendance = async () => {
  try {
    const res = await axiosAttendanceInstance.get("/my-attendance");
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load attendance"));
  }
};

export const getStudentAttendanceDetails = async (studentId) => {
  try {
    const res = await axiosAttendanceInstance.get(`/students/${studentId}`);
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load student attendance details"));
  }
};
