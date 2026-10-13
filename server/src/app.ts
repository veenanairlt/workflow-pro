import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { ZodError } from "zod";
import { projectsRouter } from "./routes/projects.js";
import { taskRouter } from "./routes/tasks.js";
export const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/projects", projectsRouter);
app.use("/api", taskRouter);
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));
const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: "Invalid input", details: error.flatten() });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};
app.use(handleError);
