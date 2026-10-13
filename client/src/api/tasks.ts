export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  projectId: string;
  createdAt: string;
}

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const taskApi = {
  list: (projectId: string) =>
    request<Task[]>(`/projects/${projectId}/tasks`),

  create: (projectId: string, title: string) =>
    request<Task>(`/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify({ title })
    }),

  update: (taskId: string, status: TaskStatus) =>
    request<Task>(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),

  delete: (taskId: string) =>
    request<void>(`/tasks/${taskId}`, {
      method: "DELETE"
    })
};