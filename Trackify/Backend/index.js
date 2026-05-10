const dotenv = require("dotenv");
dotenv.config(); // must be first so env vars are available to all imports below

const express  = require("express");
const cors     = require("cors");
const morgan   = require("morgan");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const authRoutes    = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes    = require("./routes/taskRoutes");
const userRoutes    = require("./routes/userRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Mini CRM API is running 🚀" });
});

app.use("/api/auth",     authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks",    taskRoutes);
app.use("/api/users",    userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

// connect DB first, then start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});