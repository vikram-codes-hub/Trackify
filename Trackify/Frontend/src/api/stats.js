import axiosInstance from "../utils/axiosInstance";

export const getStatsAPI = async () => {
  const res = await axiosInstance.get("/stats");
  return res.data;
};
