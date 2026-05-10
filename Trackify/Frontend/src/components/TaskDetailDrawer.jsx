import { X, Calendar, Flag, User, CheckSquare, Pencil, Clock } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import Avatar from "./Avatar";

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

const Row = ({ icon, label, children }) => (
  <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
    <span style={{ color: "var(--text-faint)", flexShrink: 0, marginTop: "2px" }}>{icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "3px" }}>{label}</p>
      {children}
    </div>
  </div>
);

const TaskDetailDrawer = ({ task, isOpen, onClose, onEdit, isAdmin }) => {
  if (!task) return null;

  const status   = statusConfig[task.status]   || statusConfig.todo;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const due       = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = due && isPast(due) && !isToday(due) && task.status !== "done";
  const isDueToday = due && isToday(due) && task.status !== "done";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 400,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity 0.25s ease",
        }}
      />

      {/* Drawer panel */}
      <div
        className="task-drawer"
        style={{
        position: "fixed", right: 0, top: 0, bottom: 0,
        width: "min(420px, 100vw)",
        background: "#0D1117",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        zIndex: 401,
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
        overflowY: "auto",
      }}>

        {/* Header */}
        <div style={{
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.02)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: priority.color, flexShrink: 0,
            }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-faint)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Task Detail
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.375rem" }}>
            {isAdmin && (
              <button
                onClick={() => { onClose(); setTimeout(() => onEdit(task), 150); }}
                className="btn-ghost"
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem", gap: "0.375rem" }}
              >
                <Pencil size={12} /> Edit
              </button>
            )}
            <button onClick={onClose} className="btn-icon" style={{ color: "var(--text-muted)" }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>

          {/* Title */}
          <div>
            <h2 style={{
              fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)",
              lineHeight: 1.4, letterSpacing: "-0.02em",
            }}>
              {task.title}
            </h2>
            {task.Project && (
              <span style={{ fontSize: "0.75rem", color: "var(--accent)", marginTop: "4px", display: "inline-block" }}>
                {task.Project.title}
              </span>
            )}
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "4px 12px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, background: status.bg, color: status.color }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: status.color }} />
              {status.label}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "4px 12px", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, background: priority.bg, color: priority.color }}>
              <Flag size={10} />
              {priority.label}
            </span>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

          {/* Metadata rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>

            {/* Assignee */}
            <Row icon={<User size={14} />} label="Assigned To">
              {task.assignedTo ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Avatar name={task.assignedTo.name} size="sm" />
                  <div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 500 }}>{task.assignedTo.name}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>{task.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>Unassigned</p>
              )}
            </Row>

            {/* Due Date */}
            {due && (
              <Row icon={<Calendar size={14} />} label="Due Date">
                <p style={{
                  fontSize: "0.875rem", fontWeight: 500,
                  color: isOverdue ? "var(--priority-high)" : isDueToday ? "var(--status-progress)" : "var(--text-primary)",
                  display: "flex", alignItems: "center", gap: "0.375rem",
                }}>
                  {isOverdue && <span style={{ fontSize: "0.8rem" }}>⚠️</span>}
                  {isDueToday && <Clock size={12} style={{ color: "var(--status-progress)" }} />}
                  {format(due, "MMMM d, yyyy")}
                  {isOverdue && <span style={{ fontSize: "0.72rem", color: "var(--priority-high)", fontWeight: 400 }}>(overdue)</span>}
                  {isDueToday && <span style={{ fontSize: "0.72rem", color: "var(--status-progress)", fontWeight: 400 }}>(today)</span>}
                </p>
              </Row>
            )}

            {/* Created by */}
            {task.createdBy && (
              <Row icon={<CheckSquare size={14} />} label="Created By">
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{task.createdBy.name}</p>
              </Row>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-faint)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.625rem" }}>Description</p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {task.description}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskDetailDrawer;
