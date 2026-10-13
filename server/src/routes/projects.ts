import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

export const projectsRouter = Router();
const projectInput = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional(),
});

projectsRouter.get("/", async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { tasks: true } } },
      take: 100,
    });
    res.json(projects);
  } catch (error) { next(error); }
});

projectsRouter.post("/", async (req, res, next) => {
  try {
    const data = projectInput.parse(req.body);
    const project = await prisma.project.create({ data });
    res.status(201).json(project);
  } catch (error) { next(error); }
});
