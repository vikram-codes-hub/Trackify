import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjectsAPI,
  getProjectByIdAPI,
  createProjectAPI,
  updateProjectAPI,
  deleteProjectAPI,
} from "../api/projects";
import toast from "react-hot-toast";

export const useProjects = (params) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjectsAPI(params),
  });
};

export const useProject = (id) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectByIdAPI(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProjectAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create project");
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProjectAPI,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", variables.id] });
      toast.success("Project updated!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update project");
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProjectAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete project");
    },
  });
};