import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import ProjectList from "./components/ProjectList";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";

const queryClient = new QueryClient();

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">
              Project Tracker
            </h1>
            <p className="text-gray-600 text-center">
              Manage your projects and tasks efficiently
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project List - Left Column */}
            <div className="md:col-span-1">
              <ProjectList
                onProjectSelect={setSelectedProject}
                selectedProject={selectedProject}
              />
            </div>

            {/* Task Management - Right Column */}
            <div className="md:col-span-2">
              {selectedProject ? (
                <div className="space-y-6">
                  <AddTask project={selectedProject} />
                  <TaskList project={selectedProject} />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
                  <p className="text-gray-500 text-lg">
                    Select a project to manage tasks
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-4 text-center text-gray-500 text-sm">
          <p>Project Tracker &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
