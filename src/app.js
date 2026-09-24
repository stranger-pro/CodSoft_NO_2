import express from "express";
import cors from "cors";

import studentRoutes from "./routes/student.route.js";
import courseRoutes from "./routes/course.route.js";
import enrollmentRoutes from "./routes/enrollment.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

export default app;