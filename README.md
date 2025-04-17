# Mini-Project-Tracker-App

A simple project and task management application that allows users to create projects and track tasks within those projects.

## Features

- Create, view, and manage projects
- Add tasks to projects with different statuses (todo, in-progress, done)
- Track task progress
- RESTful API for project and task management

## Setup Instructions

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/whatevea/Mini-Project-Tracker-App.git
```

2. Navigate to the backend directory:

```bash
cd Mini-Project-Tracker-App/backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the backend directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/project-tracker
```

Note: Replace the MONGODB_URI with your MongoDB connection string if using MongoDB Atlas.

5. Start the backend server:

```bash
npm run dev
```

The backend server should now be running on http://localhost:3000.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd Mini-Project-Tracker-App/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend application should now be running and accessible in your browser (typically at http://localhost:5173).
