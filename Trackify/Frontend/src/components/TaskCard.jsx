import { Pencil, Trash2, User, Calendar, Flag, AlertTriangle, Clock } from "lucide-react";
import Avatar from "./Avatar";
import useAuth from "../hooks/useAuth";
import { format, isPast, isToday } from "date-fns";
import { useState } from "react";

const statusConfig = {
  done:          { label: "Done",        color: "var(--status-done)",     bg: "var(--status-done-bg)" },
  "in-progress": { label: "In Progress", color: "var(--status-progress)", bg: "var(--status-progress-bg)" },
  todo:          { label: "To Do",       color: "var(--text-muted)",      bg: "var(--status-todo-bg)" },
};

const priorityConfig = {
  high:   { label: "High",   color: "var(--priority-high)",   bg: "var(--priority-high-bg)" },
  medium: { label: "Medium", color: "var(--priority-medium)", bg: "var(--priority-medium-bg)" },
  low:    { label: "Low",    color: "var(--priority-low)",    bg: "var(--priority-low-bg)" },
};

/* onView is called with the task — parent controls the drawer (one at a time) */
const TaskCard = ({ task, onEdit, onDelete, onView }) => {
  const { isAdmin } = useAuth();
  const [hovered, setHovered] = useState(false);

  const status   = statusConfig[task.status]    || statusConfig.todo;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const due        = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue  = due && isPast(due) && !isToday(due) && task.status !== "done";
  const isDueToday = due && isToday(due) && task.status !== "done";

  const borderColor = hovered
    ? isOverdue ? "rgba(248,113,113,0.45)" : "rgba(255,255,255,0.14)"
    : isOverdue ? "rgba(248,113,113,0.25)" : "var(--bg-border)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView?.(task)}
      style={{
        background: hovered ? "var(--bg-card-hover)" : "var(--bg-card)",
        border: `1px solid ${borderColor}`,
        borderRadius: "14px",
        padding: "1rem",
        transition: "all 0.2s",
        position: "relative",
        boxShadow: isOverdue && hovered ? "0 0 16px rgba(248,113,113,0.12)" : hovered ? "0 0 16px rgba(99,102,241,0.1)" : "none",
        cursor: "pointer",
      }}
    >
      {/* Priority stripe */}
      <div style={{
        position: "absolute", left: 0, top: "12px", bottom: "12px", width: "3px",
        background: isOverdue ? "var(--priority-high)" : priority.color,
        borderRadius: "0 2px 2px 0", opacity: 0.75,
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

          {/* Actions — stop propagation so they don't open the drawer */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", gap: "2px", opacity: hovered ? 1 : 0, transition: "opacity 0.2s", flexShrink: 0 }}
          >
            <button onClick={() => onEdit(task)} className="btn-icon" style={{ width: "28px", height: "28px" }}>
              <Pencil size={12} />
            </button>
            {isAdmin && (
              <button onClick={() => onDelete(task.id)} className="btn-icon danger" style={{ width: "28px", height: "28px" }}>
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.75rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "2px 8px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600, background: status.bg, color: status.color }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: status.color, flexShrink: 0 }} />
            {status.label}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "2px 8px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600, background: priority.bg, color: priority.color }}>
            <Flag size={9} />
            {priority.label}
          </span>
          {isOverdue && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "2px 8px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600, background: "rgba(248,113,113,0.12)", color: "var(--priority-high)", animation: "pulse 2s infinite" }}>
              <AlertTriangle size={9} /> Overdue
            </span>
          )}
          {isDueToday && !isOverdue && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "2px 8px", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 600, background: "rgba(251,191,36,0.12)", color: "var(--status-progress)" }}>
              <Clock size={9} /> Due Today
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--bg-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
            {task.assignedTo ? (
              <>
                <Avatar name={task.assignedTo.name} size="sm" />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100px" }}>
                  {task.assignedTo.name}
                </span>
              </>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--text-faint)" }}>
                <User size={11} /> Unassigned
              </span>
            )}
          </div>
          {due && (
            <span style={{
              display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.72rem", flexShrink: 0,
              color: isOverdue ? "var(--priority-high)" : isDueToday ? "var(--status-progress)" : "var(--text-muted)",
              fontWeight: isOverdue || isDueToday ? 600 : 400,
            }}>
              <Calendar size={11} />
              {format(due, "MMM d")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;