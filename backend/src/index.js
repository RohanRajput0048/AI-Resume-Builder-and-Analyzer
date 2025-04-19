import express from "express";
import cors from "cors";
import router from "./routes/resumeRoutes.js";
import dotenv from "dotenv";
import resumeAnalyzerRoutes from "./routes/resumeAnalyzerRoutes.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000


// Middlewares
app.use(cors());
app.use(express.json({limit: "5mb"}));

// Health check route
app.get("/", (req, res) => {
  res.send("Resume Builder Backend is running ");
});

// Routes
app.use("/api/resume", router);
app.use("/api/resume/analyze", resumeAnalyzerRoutes);

// Error Handling
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
