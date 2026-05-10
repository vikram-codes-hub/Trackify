import { useQuery } from "@tanstack/react-query";
import { getStatsAPI } from "../api/stats";
import useAuth from "./useAuth";

export const useStats = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ["stats"],
    queryFn:  getStatsAPI,
    enabled:  isAdmin,
    staleTime: 1000 * 30, // refresh every 30s
  });
};
