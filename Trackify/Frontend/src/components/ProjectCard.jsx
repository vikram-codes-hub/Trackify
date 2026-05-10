import { useNavigate } from "react-router-dom";
import { Users, CheckSquare, Pencil, Trash2 } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { format } from "date-fns";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="card hover:border-accent/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-accent/5 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-sm text-text-muted mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="p-1.5 rounded-lg hover:bg-border text-text-muted hover:text-text-primary transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <Users size={13} />
          <span>{project.members?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-xs">
          <CheckSquare size={13} />
          <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;