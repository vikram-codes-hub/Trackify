import useAuthStore from "../store/authStore";

const useAuth = () => {
  const { user, token, login, logout } = useAuthStore();

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!token;

  return { user, token, login, logout, isAdmin, isLoggedIn };
};

export default useAuth;