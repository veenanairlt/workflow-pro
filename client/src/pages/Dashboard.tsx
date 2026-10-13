import { useEffect, useState, type FormEvent } from "react";
import { createProject, listProjects } from "../api/projects";
import { ProjectCard } from "../components/ProjectCard";
import type { Project } from "../types/project";
export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    listProjects().then(data => { if (active) setProjects(data); }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy || name.trim().length < 2) return;
    setBusy(true); setError("");
    try {
      const project = await createProject({ name: name.trim(), description: description.trim() });
      setProjects(prev => [{ ...project, _count: { tasks: 0 } }, ...prev]);
      setName(""); setDescription("");
    } catch (err) { setError(err instanceof Error ? err.message : "Unknown error"); }
    finally { setBusy(false); }
  }
  return <main className="layout"><header><span className="eyebrow">WORKFLOW PRO</span><h1>Projects dashboard</h1><p>Manage work across your team.</p></header>
    <section className="panel"><h2>Create a project</h2><form onSubmit={submit}><label>Project name<input value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} placeholder="Website redesign" /></label><label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={1000} placeholder="What is this project about?" /></label><button disabled={busy}>{busy ? "Creating…" : "Create project"}</button></form></section>
    {error && <p role="alert" className="error">{error}. Check that the backend and database are running.</p>}
    <section><h2>Your projects ({projects.length})</h2><div className="cards">{projects.map(p => <ProjectCard key={p.id} project={p} />)}</div>{projects.length === 0 && !error && <p>No projects yet. Create your first one above.</p>}</section>
  </main>;
}
