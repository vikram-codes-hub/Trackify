import axiosInstance from "../utils/axiosInstance";

export const getTasksAPI = async (params = {}) => {
  const res = await axiosInstance.get("/tasks", { params });
  return res.data;
};

export const getTaskByIdAPI = async (id) => {
  const res = await axiosInstance.get(`/tasks/${id}`);
  return res.data;
};

export const createTaskAPI = async (data) => {
  const res = await axiosInstance.post("/tasks", data);
  return res.data;
};

export const updateTaskAPI = async ({ id, ...data }) => {
  const res = await axiosInstance.put(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTaskAPI = async (id) => {
  const res = await axiosInstance.delete(`/tasks/${id}`);
  return res.data;
};