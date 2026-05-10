import axiosInstance from "../utils/axiosInstance";

export const getUsersAPI = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};
