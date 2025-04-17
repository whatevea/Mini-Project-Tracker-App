import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFetch } from "../../http/useFetch";
import api from "../../http/api";

const TaskList = ({ project }) => {
  const STATUS_OPTIONS = ["todo", "in-progress", "done"];
  const queryClient = useQueryClient();

  // Fetch tasks for the selected project using the custom hook
  const { data, isLoading, isError, error } = useFetch({
    endpoint: `/project/${project?._id}/tasks`,
    key: ["tasks", project?._id],
    enabled: !!project,
  });

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      const response = await api.put(`/task/${taskId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch tasks after status update
      queryClient.invalidateQueries({ queryKey: ["tasks", project?._id] });
    },
  });

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  if (!project) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please select a project to view tasks
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <svg
          className="animate-spin h-8 w-8 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        Error loading tasks: {error?.message || "Unknown error"}
      </div>
    );
  }

  const tasks = data?.data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-gray-100";
      case "in-progress":
        return "bg-blue-100";
      case "done":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Tasks for {project.title}
      </h2>

      {tasks.length > 0 ? (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`${getStatusColor(
                task.status
              )} p-3 rounded-md border border-gray-200 flex justify-between items-center`}
            >
              <span className="font-medium text-gray-800">{task.title}</span>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="ml-2 p-1.5 text-sm border rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                disabled={updateTaskMutation.isPending}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic py-4 text-center">
          No tasks found for this project
        </p>
      )}
    </div>
  );
};

export default TaskList;
