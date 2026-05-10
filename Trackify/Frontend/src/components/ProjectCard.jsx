import { useNavigate } from "react-router-dom";
import { Users, Calendar, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";
import { useState } from "react";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [hovered, setHovered] = useState(false);

  const id = project.id || project._id;

  // Generate a consistent color from title
  const colors = [
    ["#6366F1", "rgba(99,102,241,0.15)"],
    ["#8B5CF6", "rgba(139,92,246,0.15)"],
    ["#EC4899", "rgba(236,72,153,0.15)"],
    ["#14B8A6", "rgba(20,184,166,0.15)"],
    ["#F59E0B", "rgba(245,158,11,0.15)"],
    ["#3B82F6", "rgba(59,130,246,0.15)"],
  ];
  const [accent, accentBg] = colors[(project.title?.charCodeAt(0) || 0) % colors.length];

  return (
    <div
      onClick={() => navigate(`/projects/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-card-hover)" : "var(--bg-card)",
        border: `1px solid ${hovered ? accent + "55" : "var(--bg-border)"}`,
        borderRadius: "16px",
        padding: "1.25rem",
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${accent}22` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, ${accent}, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.2s",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", flex: 1, minWidth: 0 }}>
          {/* Icon */}
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: accentBg, color: accent, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", fontWeight: 700,
          }}>
            {project.title?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{
              fontWeight: 600, fontSize: "0.9375rem",
              color: hovered ? accent : "var(--text-primary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}>
              {project.title}
            </h3>
            {project.description && (
              <p style={{
                fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                lineHeight: 1.5,
              }}>
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div style={{
            display: "flex", gap: "2px",
            opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="btn-icon"
              style={{ width: "28px", height: "28px" }}
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              className="btn-icon danger"
              style={{ width: "28px", height: "28px" }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginTop: "1rem", paddingTop: "0.875rem",
        borderTop: "1px solid var(--bg-border)",
      }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
            <Users size={12} />
            <span>{project.members?.length || 0} members</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
            <Calendar size={12} />
            <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
          </div>
        </div>
        <ArrowUpRight size={14} style={{ color: hovered ? accent : "var(--text-faint)", transition: "color 0.2s" }} />
      </div>
    </div>
  );
};

export default ProjectCard;