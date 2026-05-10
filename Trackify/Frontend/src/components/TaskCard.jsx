import { Pencil, Trash2, User, Calendar, Flag } from "lucide-react";
import Avatar from "./Avatar";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";
import { useState } from "react";

const statusConfig = {
  done:        { label: "Done",        color: "var(--status-done)",     bg: "var(--status-done-bg)" },
  "in-progress":{ label: "In Progress", color: "var(--status-progress)", bg: "var(--status-progress-bg)" },
  todo:        { label: "To Do",       color: "var(--text-muted)",      bg: "var(--status-todo-bg)" },
};

const priorityConfig = {
  high:   { label: "High",   color: "var(--priority-high)",   bg: "var(--priority-high-bg)" },
  medium: { label: "Medium", color: "var(--priority-medium)", bg: "var(--priority-medium-bg)" },
  low:    { label: "Low",    color: "var(--priority-low)",    bg: "var(--priority-low-bg)" },
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  const [hovered, setHovered] = useState(false);

  const status   = statusConfig[task.status]   || statusConfig.todo;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-card-hover)" : "var(--bg-card)",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.14)" : "var(--bg-border)"}`,
        borderRadius: "14px",
        padding: "1rem",
        transition: "all 0.2s",
        position: "relative",
      }}
    >
      {/* Priority stripe */}
      <div style={{
        position: "absolute", left: 0, top: "12px", bottom: "12px", width: "3px",
        background: priority.color, borderRadius: "0 2px 2px 0", opacity: 0.7,
      }} />

      <div style={{ paddingLeft: "0.5rem" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontSize: "0.875rem", fontWeight: 500, color: "var(--text-primary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {task.title}
            </p>
            {task.description && (
              <p style={{
                fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "3px", lineHeight: 1.5,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "2px", opacity: hovered ? 1 : 0, transition: "opacity 0.2s", flexShrink: 0 }}>
            <button onClick={() => onEdit(task)} className="btn-icon" style={{ width: "28px", height: "28px" }}>
              <Pencil size={12} />
            </button>
            {isAdmin && (
              <button onClick={() => onDelete(task.id || task._id)} className="btn-icon danger" style={{ width: "28px", height: "28px" }}>
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.75rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "2px 8px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.03em", background: status.bg, color: status.color }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: status.color, flexShrink: 0 }} />
            {status.label}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "2px 8px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.03em", background: priority.bg, color: priority.color }}>
            <Flag size={9} />
            {priority.label}
          </span>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--bg-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            {task.assignedTo ? (
              <>
                <Avatar name={task.assignedTo.name} size="sm" />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{task.assignedTo.name}</span>
              </>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--text-faint)" }}>
                <User size={11} /> Unassigned
              </span>
            )}
          </div>
          {task.dueDate && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              <Calendar size={11} />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;