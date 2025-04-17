import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import api from "../../http/api";

const TaskList = ({ project }) => {
  const STATUS_OPTIONS = ["todo", "in-progress", "done"];
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", project?._id],
    queryFn: async () => {
      const response = await api.get(`/project/${project._id}/tasks`);
      return response.data;
    },
    enabled: !!project,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      const response = await api.put(`/task/${taskId}/status`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", project?._id] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const response = await api.delete(`/task/${taskId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", project?._id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Tasks for {project.title}
        </h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Tasks for {project.title}
        </h2>
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          Error loading tasks. Please try again.
        </div>
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
              <div className="flex items-center space-x-2">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  className="p-1.5 text-sm border rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={updateTaskMutation.isPending}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  title="Delete task"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
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
