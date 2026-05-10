import { LogOut, Zap, Bell } from "lucide-react";
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
    <header style={{
      height: "56px",
      borderBottom: "1px solid var(--bg-border)",
      background: "rgba(8,11,20,0.85)",
      backdropFilter: "blur(20px)",
      display: "flex",
      alignItems: "center",
      padding: "0 1.5rem",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 40,
    }}>
      {/* Logo */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        <div style={{
          width: "28px", height: "28px", borderRadius: "8px",
          background: "linear-gradient(135deg, #6366F1, #818CF8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 12px rgba(99,102,241,0.35)",
        }}>
          <Zap size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.9375rem", letterSpacing: "-0.02em" }}>
          Trackify
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {/* User info */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          padding: "0.375rem 0.75rem",
          background: "var(--bg-card)",
          border: "1px solid var(--bg-border)",
          borderRadius: "10px",
        }}>
          <Avatar name={user?.name} size="sm" />
          <div style={{ display: "none", flexDirection: "column" }} className="user-meta">
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>{user?.name}</p>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "capitalize", marginTop: "2px" }}>{user?.role}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1 }}>{user?.name}</p>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "capitalize", marginTop: "2px" }}>{user?.role}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="btn-icon"
          style={{ width: "36px", height: "36px", borderRadius: "10px", border: "1px solid var(--bg-border)", background: "var(--bg-card)" }}
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;