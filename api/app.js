const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/tasks", taskRoutes);

// Export the app for Vercel
module.exports = app;
