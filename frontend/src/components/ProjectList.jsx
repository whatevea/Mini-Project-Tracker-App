import { useState } from "react";
import { useFetch } from "../../http/useFetch";
import api from "../../http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ProjectList = ({ onProjectSelect }) => {
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const queryClient = useQueryClient();

  // Fetch projects using the custom hook
  const { data, isLoading, isError, error } = useFetch({
    endpoint: "/project",
    key: ["projects"],
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (projectData) => {
      const response = await api.post("/project/add", projectData);
      return response.data;
    },
    onSuccess: () => {
      // Reset form and invalidate projects query to trigger refetch
      setNewProject({ title: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId) => {
      const response = await api.delete(`/project/${projectId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    addProjectMutation.mutate(newProject);
  };

  const handleDeleteProject = (e, projectId) => {
    e.stopPropagation(); // Prevent triggering the onClick of the parent element
    deleteProjectMutation.mutate(projectId);
  };

  if (isError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        Error loading projects: {error?.message || "Unknown error"}
      </div>
    );
  }

  const projects = data?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Projects</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newProject.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={newProject.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
          />
        </div>
        <button
          type="submit"
          disabled={addProjectMutation.isPending}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            addProjectMutation.isPending ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {addProjectMutation.isPending ? (
            <span className="flex items-center">
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
            "Add Project"
          )}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Project List
        </h3>

        {isLoading ? (
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
        ) : projects.length === 0 ? (
          <p className="text-gray-500 italic py-4">No projects found</p>
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li
                key={project._id}
                onClick={() => onProjectSelect(project)}
                className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-start"
              >
                <div>
                  <h4 className="font-medium text-gray-800">{project.title}</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {project.description}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Tasks: {project.tasks?.length || 0}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteProject(e, project._id)}
                  disabled={deleteProjectMutation.isPending}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
