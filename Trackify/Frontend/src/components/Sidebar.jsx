import { useNavigate, useLocation } from "react-router-dom";
import { FolderOpen, LayoutDashboard, ChevronRight } from "lucide-react";
import { useProjects } from "../hooks/useProjects";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useProjects({ limit: 20 });
  const projects = data?.data?.projects || [];

  const isActive = (path) => location.pathname === path;

  const navBtn = (label, icon, path) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => navigate(path)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          padding: "0.5rem 0.75rem",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontSize: "0.8125rem",
          fontWeight: active ? 600 : 400,
          fontFamily: "Inter, sans-serif",
          transition: "all 0.15s",
          textAlign: "left",
          background: active ? "var(--accent-subtle)" : "transparent",
          color: active ? "var(--accent)" : "var(--text-muted)",
          borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-secondary)"; }
        }}
        onMouseLeave={(e) => {
          if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }
        }}
      >
        <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>
        <span style={{ flexGrow: 1 }}>{label}</span>
        {active && <ChevronRight size={12} />}
      </button>
    );
  };

  return (
    <aside style={{
      width: "220px",
      flexShrink: 0,
      background: "rgba(255,255,255,0.015)",
      borderRight: "1px solid var(--bg-border)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "1rem 0.75rem",
      overflowY: "auto",
    }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {navBtn("Dashboard", <LayoutDashboard size={15} />, "/dashboard")}
      </nav>

      {projects.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <p style={{
            fontSize: "0.65rem", fontWeight: 700, color: "var(--text-faint)",
            textTransform: "uppercase", letterSpacing: "0.1em",
            padding: "0 0.75rem", marginBottom: "0.5rem",
          }}>
            Projects
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {projects.map((project) => {
              const active = location.pathname === `/projects/${project.id || project._id}`;
              return (
                <button
                  key={project.id || project._id}
                  onClick={() => navigate(`/projects/${project.id || project._id}`)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4375rem 0.75rem",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontFamily: "Inter, sans-serif",
                    textAlign: "left",
                    fontWeight: active ? 600 : 400,
                    background: active ? "var(--accent-subtle)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-muted)",
                    transition: "all 0.15s",
                    borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                  }}
                >
                  <FolderOpen size={13} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {project.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;