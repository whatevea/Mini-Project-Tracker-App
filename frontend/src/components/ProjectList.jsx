import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../http/api";

const ProjectList = ({ onProjectSelect, selectedProject }) => {
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const queryClient = useQueryClient();

  // Fetch projects
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await api.get("/project");
      return response.data;
    },
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: async (projectData) => {
      const response = await api.post("/project/add", projectData);
      return response.data;
    },
    onSuccess: () => {
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
      if (
        selectedProject &&
        selectedProject._id === deleteProjectMutation.variables
      ) {
        onProjectSelect(null);
      }
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProject.title.trim()) {
      addProjectMutation.mutate(newProject);
    }
  };

  const handleDeleteProject = (e, projectId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  const projects = data?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Projects</h2>

      {/* Add Project Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-3">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newProject.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Project name"
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProject.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows="2"
            placeholder="Project description"
          />
        </div>
        <button
          type="submit"
          disabled={addProjectMutation.isPending}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
        >
          {addProjectMutation.isPending ? "Adding..." : "Add Project"}
        </button>
      </form>

      {/* Project List */}
      <div>
        <h3 className="text-lg font-medium mb-3 text-gray-700">My Projects</h3>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : isError ? (
          <div className="text-red-500 p-3 bg-red-50 rounded-md">
            Error loading projects. Please try again.
          </div>
        ) : projects.length === 0 ? (
          <p className="text-gray-500 italic py-4 text-center">
            No projects found
          </p>
        ) : (
          <ul className="space-y-2 overflow-y-auto max-h-[400px]">
            {projects.map((project) => (
              <li
                key={project._id}
                onClick={() => onProjectSelect(project)}
                className={`border rounded-md p-3 hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-start ${
                  selectedProject && selectedProject._id === project._id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200"
                }`}
              >
                <div>
                  <h4 className="font-medium text-gray-800">{project.title}</h4>
                  {project.description && (
                    <p className="text-gray-600 text-sm mt-1">
                      {project.description}
                    </p>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    Tasks: {project.tasks?.length || 0}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDeleteProject(e, project._id)}
                  disabled={deleteProjectMutation.isPending}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  title="Delete project"
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
