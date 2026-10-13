export interface Project { id: string; name: string; description: string | null; _count?: { tasks: number }; }
export interface ProjectInput { name: string; description?: string; }
