import type { Project } from "../types/project";
export function ProjectCard({ project }: { project: Project }) {
  return <article className="card"><h3>{project.name}</h3><p>{project.description || "No description yet"}</p><small>{project._count?.tasks ?? 0} tasks</small></article>;
}
