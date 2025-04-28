import express from "express";
import cors from "cors";
import router from "./routes/resumeRoutes.js";
import dotenv from "dotenv";
import resumeAnalyzerRoutes from "./routes/resumeAnalyzerRoutes.js";

dotenv.config()

const app = express();

// --- CORS Configuration ---
// List of allowed origins (URLs that can make requests to your backend)
const allowedOrigins = [
  'http://localhost:3000',      // Your LOCAL frontend dev server
  // Add your Vercel URL HERE once you deploy the frontend
  // 'https://your-frontend-name.vercel.app'
];

const corsOptions = {
origin: function (origin, callback) {
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);
  // Allow if the origin is in our list
  if (allowedOrigins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    // Disallow if not in the list
    callback(new Error('Not allowed by CORS'));
  }
},
optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Use CORS middleware with options
// --- End CORS Configuration ---


const PORT = process.env.PORT || 5000


// Middlewares
app.use(cors());
app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({ extended: true }));

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
