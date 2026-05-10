const dotenv = require("dotenv");
dotenv.config(); 

const express  = require("express");
const cors     = require("cors");
const morgan   = require("morgan");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

const authRoutes    = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes    = require("./routes/taskRoutes");
const userRoutes    = require("./routes/userRoutes");
const statsRoutes   = require("./routes/statsRoutes");

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin === process.env.CLIENT_URL ||
      origin.endsWith('.vercel.app') ||
      origin === 'http://localhost:3000' ||
      origin === 'http://localhost:3001' ||
      origin === 'http://localhost:5173'
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Mini CRM API is running 🚀" });
});

app.use("/api/auth",     authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks",    taskRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/stats",    statsRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

// connect DB first, then start server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});