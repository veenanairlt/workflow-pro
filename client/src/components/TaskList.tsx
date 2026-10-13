import { useEffect, useState } from "react";
import { taskApi } from "../api/tasks";
import type { Task, TaskStatus } from "../api/tasks";

interface Props {
  projectId: string;
}

export default function TaskList({ projectId }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    taskApi.list(projectId)
      .then(data => {
        if (active) setTasks(data);
      })
      .catch(() => {
        if (active) setError("Unable to load tasks");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  async function addTask() {
    if (!title.trim() || saving) return;

    setSaving(true);
    setError("");

    try {
      const task = await taskApi.create(
        projectId,
        title.trim()
      );

      setTasks(prev => [task, ...prev]);
      setTitle("");
    } catch {
      setError("Unable to create task");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    taskId: string,
    status: TaskStatus
  ) {
    try {
      const updated = await taskApi.update(taskId, status);

      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? updated : task
        )
      );
    } catch {
      setError("Unable to update task");
    }
  }

  async function deleteTask(taskId: string) {
    try {
      await taskApi.delete(taskId);

      setTasks(prev =>
        prev.filter(task => task.id !== taskId)
      );
    } catch {
      setError("Unable to delete task");
    }
  }

  return (
    <section>
      <h3>Tasks ({tasks.length})</h3>

      <form
        onSubmit={e => {
          e.preventDefault();
          void addTask();
        }}
      >
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter task title"
        />

        <button disabled={saving || !title.trim()}>
          {saving ? "Adding..." : "Add Task"}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        
<ul className="task-list">
  {tasks.map(task => (
    <li key={task.id} className="task-item">

      <span className="task-title">
        {task.title}
      </span>

      <div className="task-actions">
        <select
          className="task-status"
          value={task.status}
          onChange={e =>
            void changeStatus(
              task.id,
              e.target.value as TaskStatus
            )
          }
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>

        <button
          type="button"
          className="delete-btn"
          onClick={() => void deleteTask(task.id)}
        >
          Delete
        </button>
      </div>

    </li>
  ))}
</ul>

      )}
    </section>
  );
}