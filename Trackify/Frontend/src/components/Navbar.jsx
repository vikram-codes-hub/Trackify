import { LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Avatar from "./Avatar";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center px-6 justify-between sticky top-0 z-30">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
          <LayoutDashboard size={15} className="text-white" />
        </div>
        <span className="font-semibold text-text-primary text-sm">Mini CRM</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Avatar name={user?.name} size="sm" />
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-text-primary leading-none">{user?.name}</p>
            <p className="text-xs text-text-muted capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-border transition-colors"
          title="Logout"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;