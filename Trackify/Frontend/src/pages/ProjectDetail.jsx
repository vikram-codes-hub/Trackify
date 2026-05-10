import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, CheckSquare } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import useAuth from "../hooks/useAuth";
import { useProject } from "../hooks/useProjects";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../utils/constants";

const TaskForm = ({ initial, projectId, onSubmit, loading }) => {
  const [form, setForm] = useState(
    initial
      ? { title: initial.title, description: initial.description, status: initial.status, priority: initial.priority, dueDate: initial.dueDate?.slice(0, 10) || "" }
      : { title: "", description: "", status: "todo", priority: "medium", dueDate: "" }
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5">Title *</label>
        <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title" className="input-base" />
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Optional description" className="input-base resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-base">
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Priority</label>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="input-base">
            {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-text-muted mb-1.5">Due Date</label>
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input-base" />
      </div>
      <button onClick={() => onSubmit({ ...form, project: projectId })} disabled={loading || !form.title.trim()} className="btn-primary w-full">
        {loading ? "Saving..." : initial ? "Update Task" : "Create Task"}
      </button>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { data: projectData, isLoading: projectLoading } = useProject(id);
  const project = projectData?.data?.project;

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const { data: taskData, isLoading: tasksLoading } = useTasks({
    project: id,
    search,
    ...filters,
    page,
    limit: 10,
  });

  const tasks = taskData?.data?.tasks || [];
  const pagination = taskData?.data?.pagination;

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleCreate = async (form) => {
    await createTask.mutateAsync(form);
    setShowCreate(false);
  };

  const handleUpdate = async (form) => {
    await updateTask.mutateAsync({ id: editTask._id, ...form });
    setEditTask(null);
  };

  const handleDelete = (taskId) => {
    if (confirm("Delete this task?")) deleteTask.mutate(taskId);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Project Header */}
          {projectLoading ? (
            <div className="h-12 w-64 bg-surface animate-pulse rounded-lg mb-6" />
          ) : (
            <div className="mb-6">
              <h1 className="text-xl font-bold text-text-primary">{project?.title}</h1>
              {project?.description && (
                <p className="text-sm text-text-muted mt-1">{project.description}</p>
              )}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex-1">
              <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search tasks..." />
            </div>
            <FilterBar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
            {isAdmin && (
              <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
                <Plus size={15} /> New Task
              </button>
            )}
          </div>

          {/* Task Grid */}
          {tasksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <div key={i} className="card h-36 animate-pulse" />)}
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <CheckSquare size={40} className="text-text-muted mb-3" />
              <p className="text-text-muted text-sm">No tasks found</p>
              {isAdmin && (
                <button onClick={() => setShowCreate(true)} className="btn-primary mt-4">
                  Create first task
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={setEditTask}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              <Pagination page={page} totalPages={pagination?.totalPages || 1} onPageChange={setPage} />
            </>
          )}
        </main>
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Task">
        <TaskForm projectId={id} onSubmit={handleCreate} loading={createTask.isPending} />
      </Modal>

      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
        {editTask && (
          <TaskForm initial={editTask} projectId={id} onSubmit={handleUpdate} loading={updateTask.isPending} />
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;