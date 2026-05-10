import axiosInstance from "../utils/axiosInstance";

export const registerAPI = async (data) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const loginAPI = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const getMeAPI = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};