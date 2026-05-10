import { useState } from "react";
import { Plus, FolderOpen, Layers } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import useAuth from "../hooks/useAuth";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "../hooks/useProjects";

const ProjectForm = ({ initial, onSubmit, loading }) => {
  const [form, setForm] = useState(initial || { title: "", description: "" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
      <div>
        <label className="form-label">Project title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Website Redesign"
          className="input-base"
        />
      </div>
      <div>
        <label className="form-label">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="What is this project about?"
          rows={3}
          className="input-base"
          style={{ resize: "none" }}
        />
      </div>
      <button
        onClick={() => onSubmit(form)}
        disabled={loading || !form.title.trim()}
        className="btn-primary"
        style={{ width: "100%", padding: "0.6875rem" }}
      >
        {loading ? (
          <div className="spinner" style={{ width: "16px", height: "16px" }} />
        ) : initial ? "Update Project" : "Create Project"}
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const { data, isLoading } = useProjects({ page, limit: 9 });
  const projects = data?.data?.projects || [];
  const pagination = data?.data?.pagination;

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const handleCreate = async (form) => {
    await createProject.mutateAsync(form);
    setShowCreate(false);
  };

  const handleUpdate = async (form) => {
    await updateProject.mutateAsync({ id: editProject.id || editProject._id, ...form });
    setEditProject(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this project and all its tasks?")) {
      deleteProject.mutate(id);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.75rem 2rem" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.375rem" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                  <Layers size={16} />
                </div>
                <h1 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                  Projects
                </h1>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                {pagination?.total || 0} total projects
              </p>
            </div>
            {isAdmin && (
              <button onClick={() => setShowCreate(true)} className="btn-primary">
                <Plus size={15} />
                New Project
              </button>
            )}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "160px" }} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FolderOpen size={24} /></div>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)" }}>No projects yet</p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Create your first project to get started.</p>
              {isAdmin && (
                <button onClick={() => setShowCreate(true)} className="btn-primary" style={{ marginTop: "0.5rem" }}>
                  <Plus size={15} /> Create project
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                {projects.map((project, i) => (
                  <div key={project.id || project._id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <ProjectCard project={project} onEdit={setEditProject} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
              <Pagination page={page} totalPages={pagination?.totalPages || 1} onPageChange={setPage} />
            </>
          )}
        </main>
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Project">
        <ProjectForm onSubmit={handleCreate} loading={createProject.isPending} />
      </Modal>

      <Modal isOpen={!!editProject} onClose={() => setEditProject(null)} title="Edit Project">
        {editProject && (
          <ProjectForm initial={editProject} onSubmit={handleUpdate} loading={updateProject.isPending} />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;