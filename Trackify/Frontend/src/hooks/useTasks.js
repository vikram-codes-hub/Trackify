import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import {
  getTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
} from "../api/tasks";
import toast from "react-hot-toast";
import useAuth from "./useAuth";

const SEEN_KEY = "trackify_seen_tasks";

/* ── Fetch tasks — with session-based assignment notification ── */
export const useTasks = (params) => {
  const { user, isAdmin } = useAuth();
  const notifiedRef = useRef(false);

  const query = useQuery({
    queryKey: ["tasks", params],
    queryFn: () => getTasksAPI(params),
  });

  useEffect(() => {
    // Only fire for non-admin users, once per browser session
    if (isAdmin || notifiedRef.current || !query.data) return;
    notifiedRef.current = true;

    const tasks = query.data?.data?.tasks || [];
    if (!tasks.length) return;

    // Load previously-seen task IDs from sessionStorage
    let seen;
    try {
      seen = new Set(JSON.parse(sessionStorage.getItem(SEEN_KEY) || "[]"));
    } catch {
      seen = new Set();
    }

    // Find tasks assigned to this user that are new since last session
    const myTasks = tasks.filter(
      (t) => t.assignedToId === user?.id || t.assignedTo?.id === user?.id
    );

    myTasks.forEach((t) => {
      if (!seen.has(String(t.id))) {
        toast(`📌 Assigned: ${t.title}`, {
          icon: "🔔",
          style: {
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#F1F5F9",
          },
        });
        seen.add(String(t.id));
      }
    });

    // Persist updated seen set
    try {
      sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
    } catch { /* ignore */ }
  }, [query.data, isAdmin, user?.id]);

  return query;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTaskAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Task created!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create task");
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTaskAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Task updated!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update task");
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTaskAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      toast.success("Task deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete task");
    },
  });
};