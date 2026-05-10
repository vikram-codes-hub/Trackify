import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FolderOpen, LayoutDashboard, ChevronRight, Menu, X } from "lucide-react";
import { useProjects } from "../hooks/useProjects";

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { data }  = useProjects({ limit: 20 });
  const projects  = data?.data?.projects || [];
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navBtn = (label, icon, path) => {
    const active = isActive(path);
    return (
      <button
        key={path}
        onClick={() => { navigate(path); setMobileOpen(false); }}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "0.625rem",
          padding: "0.5rem 0.75rem", borderRadius: "10px", border: "none",
          cursor: "pointer", fontSize: "0.8125rem",
          fontWeight: active ? 600 : 400, fontFamily: "Inter, sans-serif",
          transition: "all 0.15s", textAlign: "left",
          background: active ? "var(--accent-subtle)" : "transparent",
          color:      active ? "var(--accent)"        : "var(--text-muted)",
          borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
        }}
        onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}
      >
        <span style={{ display: "flex", flexShrink: 0 }}>{icon}</span>
        <span style={{ flexGrow: 1 }}>{label}</span>
        {active && <ChevronRight size={12} />}
      </button>
    );
  };

  const sidebarContent = (
    <>
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
              const active = location.pathname === `/projects/${project.id}`;
              return (
                <button
                  key={project.id}
                  onClick={() => { navigate(`/projects/${project.id}`); setMobileOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.4375rem 0.75rem", borderRadius: "10px", border: "none",
                    cursor: "pointer", fontSize: "0.8rem", fontFamily: "Inter, sans-serif",
                    textAlign: "left", fontWeight: active ? 600 : 400,
                    background: active ? "var(--accent-subtle)" : "transparent",
                    color:      active ? "var(--accent)"        : "var(--text-muted)",
                    transition: "all 0.15s",
                    borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}
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
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────── */}
      <aside
        className="app-sidebar"
        style={{
          width: "220px", flexShrink: 0,
          background: "rgba(255,255,255,0.015)",
          borderRight: "1px solid var(--bg-border)",
          height: "100%", display: "flex", flexDirection: "column",
          padding: "1rem 0.75rem", overflowY: "auto",
        }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile hamburger button ───────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="mobile-menu-btn"
        style={{
          display: "none",   /* shown via CSS media query */
          position: "fixed", bottom: "1.25rem", left: "1.25rem",
          zIndex: 500,
          width: "44px", height: "44px", borderRadius: "12px",
          background: "var(--accent)",
          border: "none", cursor: "pointer",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          color: "#fff",
        }}
      >
        <Menu size={18} />
      </button>

      {/* ── Mobile slide-over sidebar ─────────────────────── */}
      <>
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            display: mobileOpen ? "block" : "none",
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
            zIndex: 490,
          }}
        />
        {/* Panel */}
        <aside style={{
          position: "fixed", left: 0, top: 0, bottom: 0,
          width: "260px",
          background: "#0D1117",
          borderRight: "1px solid var(--bg-border)",
          padding: "1.25rem 0.75rem",
          overflowY: "auto",
          zIndex: 495,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <button onClick={() => setMobileOpen(false)} className="btn-icon">
              <X size={16} />
            </button>
          </div>
          {sidebarContent}
        </aside>
      </>
    </>
  );
};

export default Sidebar;