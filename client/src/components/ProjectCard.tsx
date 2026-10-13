
import type { Project } from "../types/project";
import TaskList from "../components/TaskList";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card">
      <h3>{project.name}</h3>

      <p>
        {project.description || "No description yet"}
      </p>

      <TaskList projectId={project.id} />
    </article>
  );
}
