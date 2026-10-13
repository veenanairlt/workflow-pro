import type { Project, ProjectInput } from "../types/project";
const base = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, init);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}
export const listProjects = () => request<Project[]>("/api/projects");
export const createProject = (data: ProjectInput) => request<Project>("/api/projects", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
});
