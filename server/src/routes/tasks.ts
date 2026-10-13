import { Router } from "express";
import { Prisma, TaskStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const taskRouter = Router();

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  status: z.nativeEnum(TaskStatus).optional()
});

const updateTaskSchema = createTaskSchema.partial()
  .refine(data => Object.keys(data).length > 0, {
    message: "At least one field is required"
  });

const idSchema = z.string().cuid();

// Create task
taskRouter.post(
  "/projects/:projectId/tasks",
  async (req, res, next) => {
    try {
      const projectId = idSchema.parse(req.params.projectId);
      const data = createTaskSchema.parse(req.body);

      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }

      const task = await prisma.task.create({
        data: {
          ...data,
          projectId
        }
      });

      return res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  }
);

// Get all tasks for a project
taskRouter.get(
  "/projects/:projectId/tasks",
  async (req, res, next) => {
    try {
      const projectId = idSchema.parse(req.params.projectId);

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true }
      });

      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }

      const tasks = await prisma.task.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" }
      });

      return res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
);

// Get task details
taskRouter.get(
  "/tasks/:taskId",
  async (req, res, next) => {
    try {
      const taskId = idSchema.parse(req.params.taskId);

      const task = await prisma.task.findUnique({
        where: { id: taskId }
      });

      if (!task) {
        return res.status(404).json({
          message: "Task not found"
        });
      }

      return res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

// Update task
taskRouter.patch(
  "/tasks/:taskId",
  async (req, res, next) => {
    try {
      const taskId = idSchema.parse(req.params.taskId);
      const data = updateTaskSchema.parse(req.body);

      const task = await prisma.task.update({
        where: { id: taskId },
        data
      });

      return res.json(task);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({
          message: "Task not found"
        });
      }

      next(error);
    }
  }
);

// Delete task
taskRouter.delete(
  "/tasks/:taskId",
  async (req, res, next) => {
    try {
      const taskId = idSchema.parse(req.params.taskId);

      await prisma.task.delete({
        where: { id: taskId }
      });

      return res.status(204).send();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({
          message: "Task not found"
        });
      }

      next(error);
    }
  }
);