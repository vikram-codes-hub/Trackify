import axiosInstance from "../utils/axiosInstance";

export const getProjectsAPI = async ({ page = 1, limit = 10 } = {}) => {
  const res = await axiosInstance.get("/projects", { params: { page, limit } });
  return res.data;
};

export const getProjectByIdAPI = async (id) => {
  const res = await axiosInstance.get(`/projects/${id}`);
  return res.data;
};

export const createProjectAPI = async (data) => {
  const res = await axiosInstance.post("/projects", data);
  return res.data;
};

export const updateProjectAPI = async ({ id, ...data }) => {
  const res = await axiosInstance.put(`/projects/${id}`, data);
  return res.data;
};

export const deleteProjectAPI = async (id) => {
  const res = await axiosInstance.delete(`/projects/${id}`);
  return res.data;
};