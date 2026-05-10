import { useNavigate, useLocation } from "react-router-dom";
import { FolderOpen, LayoutDashboard } from "lucide-react";
import { useProjects } from "../hooks/useProjects";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useProjects({ limit: 20 });
  const projects = data?.data?.projects || [];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-56 bg-surface border-r border-border h-full flex flex-col py-4 px-3 overflow-y-auto">
      <nav className="space-y-1">
        <button
          onClick={() => navigate("/dashboard")}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive("/dashboard")
              ? "bg-accent/15 text-accent font-medium"
              : "text-text-muted hover:text-text-primary hover:bg-border"
          }`}
        >
          <LayoutDashboard size={15} />
          Dashboard
        </button>
      </nav>

      {projects.length > 0 && (
        <div className="mt-6">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-3 mb-2">
            Projects
          </p>
          <nav className="space-y-1">
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  location.pathname === `/projects/${project._id}`
                    ? "bg-accent/15 text-accent font-medium"
                    : "text-text-muted hover:text-text-primary hover:bg-border"
                }`}
              >
                <FolderOpen size={15} className="flex-shrink-0" />
                <span className="truncate">{project.title}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;