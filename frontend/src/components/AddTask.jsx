import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../http/api";
const AddTask = ({ project }) => {
  const [newTask, setNewTask] = useState({ title: "", status: "todo" });
  const STATUS_OPTIONS = ["todo", "in-progress", "done"];
  const queryClient = useQueryClient();

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      const response = await api.post("/task", taskData);
      return response.data;
    },
    onSuccess: () => {
      // Reset form and invalidate queries to trigger refetch
      setNewTask({ title: "", status: "todo" });
      queryClient.invalidateQueries({ queryKey: ["tasks", project?._id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!project || !newTask.title.trim()) return;

    addTaskMutation.mutate({
      ...newTask,
      projectId: project._id,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Add Task to {project.title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              required
              placeholder="Enter task title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={newTask.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={addTaskMutation.isPending}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
        >
          {addTaskMutation.isPending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Adding...
            </span>
          ) : (
            "Add Task"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
