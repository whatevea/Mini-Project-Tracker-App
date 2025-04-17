import { useState, useEffect } from "react";
import "./App.css";
import ProjectList from "./components/ProjectList";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";

function App() {
  const [activeTab, setActiveTab] = useState("projects");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshProjects = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setActiveTab("tasks");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-2">
            Project Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Manage your projects and tasks efficiently
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm bg-white dark:bg-gray-800 p-1">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "projects"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              disabled={!selectedProject}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "tasks"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${
                !selectedProject
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab("addTask")}
              disabled={!selectedProject}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === "addTask"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${
                !selectedProject
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Project Info Banner */}
        {selectedProject && (
          <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                  {selectedProject.name}
                </h2>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  {selectedProject.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setActiveTab("projects");
                }}
                className="text-xs px-3 py-1 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors"
              >
                Change Project
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {activeTab === "projects" && (
            <ProjectList
              onProjectSelect={handleProjectSelect}
              refreshProjects={refreshTrigger}
              projects={projects}
              setProjects={setProjects}
            />
          )}
          {activeTab === "tasks" && (
            <TaskList
              project={selectedProject}
              refreshProjects={refreshProjects}
            />
          )}
          {activeTab === "addTask" && (
            <AddTask
              project={selectedProject}
              refreshProjects={refreshProjects}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Project Tracker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
