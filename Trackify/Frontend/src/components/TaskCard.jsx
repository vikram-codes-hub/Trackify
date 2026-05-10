import { Pencil, Trash2, User } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import Avatar from "./Avatar";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="card hover:border-accent/40 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
          {task.description && (
            <p className="text-xs text-text-muted mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-border text-text-muted hover:text-text-primary transition-colors"
          >
            <Pencil size={14} />
          </button>
          {isAdmin && (
            <button
              onClick={() => onDelete(task._id)}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          {task.assignedTo ? (
            <>
              <Avatar name={task.assignedTo.name} size="sm" />
              <span className="text-xs text-text-muted">{task.assignedTo.name}</span>
            </>
          ) : (
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <User size={12} /> Unassigned
            </span>
          )}
        </div>
        {task.dueDate && (
          <span className="text-xs text-text-muted">
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;