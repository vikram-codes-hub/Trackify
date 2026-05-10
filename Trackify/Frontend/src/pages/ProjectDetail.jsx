import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, CheckSquare, Users, Flag, Calendar, ListTodo } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import Avatar from "../components/Avatar";
import useAuth from "../hooks/useAuth";
import { useProject } from "../hooks/useProjects";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "../utils/constants";

/* ─── TaskForm ────────────────────────────────────────────────── */
const TaskForm = ({ initial, projectId, onSubmit, loading, users, isAdmin }) => {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title,
          description: initial.description || "",
          status: initial.status,
          priority: initial.priority,
          dueDate: initial.dueDate?.slice(0, 10) || "",
          assignedTo: initial.assignedTo?.id || initial.assignedToId || "",
        }
      : { title: "", description: "", status: "todo", priority: "medium", dueDate: "", assignedTo: "" }
  );

  const s = (label) => (
    <label className="form-label">{label}</label>
  );

  const selectSt = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--bg-border)",
    color: "var(--text-primary)",
    padding: "0.5625rem 0.875rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Title */}
      <div>
        {s("Title *")}
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Task title"
          className="input-base"
        />
      </div>

      {/* Description */}
      <div>
        {s("Description")}
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          placeholder="Optional description"
          className="input-base"
          style={{ resize: "none" }}
        />
      </div>

      {/* Status + Priority */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          {s("Status")}
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={selectSt}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          {s("Priority")}
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={selectSt}>
            {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {/* Assign to (admin only) */}
      {isAdmin && (
        <div>
          {s("Assign to")}
          <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} style={selectSt}>
            <option value="">Unassigned</option>
            {(users || []).map((u) => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </select>
        </div>
      )}

      {/* Due Date */}
      <div>
        {s("Due date")}
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="input-base"
        />
      </div>

      <button
        onClick={() => onSubmit({ ...form, project: projectId, assignedTo: form.assignedTo || undefined })}
        disabled={loading || !form.title.trim()}
        className="btn-primary"
        style={{ width: "100%", padding: "0.6875rem", marginTop: "0.25rem" }}
      >
        {loading
          ? <div className="spinner" style={{ width: "16px", height: "16px" }} />
          : initial ? "Update Task" : "Create Task"}
      </button>
    </div>
  );
};

/* ─── Project Stats Bar ──────────────────────────────────────── */
const StatsBar = ({ tasks }) => {
  const total    = tasks.length;
  const done     = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.filter((t) => t.status === "in-progress").length;
  const todo     = tasks.filter((t) => t.status === "todo").length;
  const pct      = total ? Math.round((done / total) * 100) : 0;

  return (
    <div style={{
      display: "flex", gap: "1rem", flexWrap: "wrap",
      marginBottom: "1.5rem",
    }}>
      {[
        { label: "Total", value: total, color: "var(--text-muted)", icon: <ListTodo size={14} /> },
        { label: "To Do", value: todo, color: "var(--text-muted)", icon: <CheckSquare size={14} /> },
        { label: "In Progress", value: progress, color: "var(--status-progress)", icon: <Flag size={14} /> },
        { label: "Done", value: done, color: "var(--status-done)", icon: <CheckSquare size={14} /> },
      ].map(({ label, value, color, icon }) => (
        <div key={label} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          background: "var(--bg-card)", border: "1px solid var(--bg-border)",
          borderRadius: "10px", padding: "0.5rem 0.875rem",
        }}>
          <span style={{ color }}>{icon}</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{label}</span>
          <span style={{ fontSize: "0.875rem", fontWeight: 700, color }}>{value}</span>
        </div>
      ))}

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginLeft: "auto" }}>
          <div style={{
            width: "120px", height: "6px",
            background: "var(--bg-border)", borderRadius: "999px", overflow: "hidden",
          }}>
            <div style={{
              width: `${pct}%`, height: "100%",
              background: "var(--status-done)", borderRadius: "999px",
              transition: "width 0.5s ease",
            }} />
          </div>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>{pct}%</span>
        </div>
      )}
    </div>
  );
};

/* ─── ProjectDetail Page ─────────────────────────────────────── */
const ProjectDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const { data: projectData, isLoading: projectLoading } = useProject(id);
  const project = projectData?.data?.project;

  const { data: usersData } = useUsers();
  const users = usersData?.data?.users || [];

  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage]       = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask]     = useState(null);

  const { data: taskData, isLoading: tasksLoading } = useTasks({
    project: id,
    search,
    ...filters,
    page,
    limit: 12,
  });

  const tasks      = taskData?.data?.tasks || [];
  const pagination = taskData?.data?.pagination;

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleCreate = async (form) => {
    await createTask.mutateAsync(form);
    setShowCreate(false);
  };

  const handleUpdate = async (form) => {
    await updateTask.mutateAsync({ id: editTask.id, ...form });
    setEditTask(null);
  };

  const handleDelete = (taskId) => {
    if (confirm("Delete this task?")) deleteTask.mutate(taskId);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.75rem 2rem" }}>

          {/* Project Header */}
          {projectLoading ? (
            <div>
              <div className="skeleton" style={{ height: "28px", width: "240px", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "16px", width: "360px" }} />
            </div>
          ) : (
            <div style={{ marginBottom: "1.5rem" }} className="fade-up">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                    {project?.title}
                  </h1>
                  {project?.description && (
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                      {project.description}
                    </p>
                  )}
                  {/* Members */}
                  {project?.members?.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.75rem" }}>
                      <Users size={13} style={{ color: "var(--text-faint)" }} />
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        {project.members.map((m) => (
                          <Avatar key={m.id} name={m.name} size="sm" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <button onClick={() => setShowCreate(true)} className="btn-primary">
                    <Plus size={15} /> New Task
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          {!tasksLoading && tasks.length > 0 && <StatsBar tasks={tasks} />}

          {/* Toolbar */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search tasks..." />
            <FilterBar filters={filters} onChange={(f) => { setFilters(f); setPage(1); }} />
          </div>

          {/* Tasks */}
          {tasksLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "140px" }} />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><CheckSquare size={22} /></div>
              <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                {search || Object.values(filters).some(Boolean) ? "No tasks match your filters" : "No tasks yet"}
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                {isAdmin ? "Create the first task to get started." : "Tasks assigned to you will appear here."}
              </p>
              {isAdmin && !search && (
                <button onClick={() => setShowCreate(true)} className="btn-primary" style={{ marginTop: "0.5rem" }}>
                  <Plus size={15} /> Create task
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {tasks.map((task, i) => (
                  <div key={task.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <TaskCard task={task} onEdit={setEditTask} onDelete={handleDelete} />
                  </div>
                ))}
              </div>
              <Pagination page={page} totalPages={pagination?.totalPages || 1} onPageChange={setPage} />
            </>
          )}
        </main>
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Task">
        <TaskForm
          projectId={id}
          onSubmit={handleCreate}
          loading={createTask.isPending}
          users={users}
          isAdmin={isAdmin}
        />
      </Modal>

      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task">
        {editTask && (
          <TaskForm
            initial={editTask}
            projectId={id}
            onSubmit={handleUpdate}
            loading={updateTask.isPending}
            users={users}
            isAdmin={isAdmin}
          />
        )}
      </Modal>
    </div>
  );
};

export default ProjectDetail;