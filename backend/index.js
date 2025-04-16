const express = require("express");
const app = express();
const projectRouter = require("./controllers/project.controller");
const connectDB = require("./database/db");
const taskRouter = require("./controllers/task.controller");
require("dotenv").config();

app.use(projectRouter);
app.use(taskRouter)

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      //   seedRoles()
      console.log("App is running on " + "http://localhost:" + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
