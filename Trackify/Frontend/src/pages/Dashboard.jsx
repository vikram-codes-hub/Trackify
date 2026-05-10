import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
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
  const [form, setForm] = useState(
    initial || { title: "", description: "" }
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Project title"
          className="input-base"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Optional description"
          rows={3}
          className="input-base resize-none"
        />
      </div>
      <button
        onClick={() => onSubmit(form)}
        disabled={loading || !form.title.trim()}
        className="btn-primary w-full"
      >
        {loading ? "Saving..." : initial ? "Update Project" : "Create Project"}
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
    await updateProject.mutateAsync({ id: editProject._id, ...form });
    setEditProject(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this project and all its tasks?")) {
      deleteProject.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Projects</h1>
              <p className="text-sm text-text-muted mt-0.5">
                {pagination?.total || 0} total projects
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowCreate(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={15} />
                New Project
              </button>
            )}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-32 animate-pulse bg-surface" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderOpen size={40} className="text-text-muted mb-3" />
              <p className="text-text-muted text-sm">No projects yet</p>
              {isAdmin && (
                <button
                  onClick={() => setShowCreate(true)}
                  className="btn-primary mt-4"
                >
                  Create your first project
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={setEditProject}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={pagination?.totalPages || 1}
                onPageChange={setPage}
              />
            </>
          )}
        </main>
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Project">
        <ProjectForm onSubmit={handleCreate} loading={createProject.isPending} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editProject} onClose={() => setEditProject(null)} title="Edit Project">
        {editProject && (
          <ProjectForm
            initial={editProject}
            onSubmit={handleUpdate}
            loading={updateProject.isPending}
          />
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;