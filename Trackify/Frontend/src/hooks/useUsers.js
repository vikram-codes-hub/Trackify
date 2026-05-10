import { useQuery } from "@tanstack/react-query";
import { getUsersAPI } from "../api/users";
import useAuth from "./useAuth";

export const useUsers = () => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsersAPI,
    enabled: isAdmin,   // only fetch for admins
    staleTime: 1000 * 60 * 5,
  });
};
