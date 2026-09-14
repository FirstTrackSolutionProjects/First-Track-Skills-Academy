import axiosBatchInstance from "../axiosInstance/axiosBatchInstance";

const extractError = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

export const getBatches = async () => {
  try {
    const res = await axiosBatchInstance.get("");
    return res.data.data;
  } catch (error) {
    try {
      const fallbackRes = await axiosBatchInstance.get("/");
      return fallbackRes.data.data;
    } catch {
      throw new Error(extractError(error, "Failed to load batches"));
    }
  }
};

export const getBatchStudents = async (batchId) => {
  try {
    const res = await axiosBatchInstance.get(`/${batchId}/students`);
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load batch students"));
  }
};

export const getBatchSubstitutes = async (batchId) => {
  try {
    const res = await axiosBatchInstance.get(`/${batchId}/substitutes`);
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load batch substitutes"));
  }
};

export const assignPrimaryMentor = async (batchId, mentorId) => {
  try {
    const res = await axiosBatchInstance.put(`/${batchId}/primary-mentor`, { mentor_id: mentorId });
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to assign primary mentor"));
  }
};

export const assignSubstituteMentor = async (batchId, payload) => {
  try {
    const res = await axiosBatchInstance.post(`/${batchId}/substitutes`, payload);
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to assign substitute mentor"));
  }
};

export const updateSubstituteStatus = async (batchId, substituteId, status) => {
  try {
    const res = await axiosBatchInstance.patch(`/${batchId}/substitutes/${substituteId}`, { status });
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to update substitute status"));
  }
};

export const allocateStudentsToBatch = async (batchId, enrollmentIds) => {
  try {
    const res = await axiosBatchInstance.post(`/${batchId}/allocate`, { enrollment_ids: enrollmentIds });
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to allocate students to batch"));
  }
};

export const unallocateStudent = async (batchId, enrollmentId) => {
  try {
    const res = await axiosBatchInstance.post(`/${batchId}/unallocate`, { enrollment_id: enrollmentId });
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to unallocate student"));
  }
};

export const transferStudentBatch = async (batchId, payload) => {
  try {
    const res = await axiosBatchInstance.post(`/${batchId}/transfer`, payload);
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to transfer student"));
  }
};

export const autoAllocateStudents = async (payload) => {
  try {
    const res = await axiosBatchInstance.post("/auto-allocate", payload);
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to auto-allocate students"));
  }
};

export const getUnallocatedStudents = async (params = {}) => {
  try {
    const res = await axiosBatchInstance.get("/unallocated-students", { params });
    return res.data.data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load unallocated students"));
  }
};

export const getMyMentorBatches = async () => {
  try {
    const res = await axiosBatchInstance.get("/my-batches");
    return res.data.data;
  } catch (error) {
    try {
      const fallbackRes = await axiosBatchInstance.get("");
      return fallbackRes.data.data;
    } catch {
      throw new Error(extractError(error, "Failed to load mentor batches"));
    }
  }
};
