import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusOptions = ['todo', 'in-progress', 'review', 'done'];

const TasksPage = () => {
  const auth = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', project: '', assignee: '', priority: 'medium', status: 'todo' });
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', project: '', assignee: '', priority: 'medium', status: 'todo' });

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksResponse, projectsResponse, membersResponse] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects'),
          auth?.user?.role === 'admin' ? api.get('/users/team').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        ]);

        setTasks(tasksResponse.data);
        setProjects(projectsResponse.data);
        setMembers(membersResponse.data);

        if (projectsResponse.data.length > 0) {
          setForm((current) => ({ ...current, project: current.project || projectsResponse.data[0]._id }));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load tasks');
      }
    };

    load();
  }, [auth?.user?.role]);

  const createTask = async (event) => {
    event.preventDefault();

    if (!form.project) {
      toast.error('Select a project before creating the task');
      return;
    }

    try {
      const { data } = await api.post('/tasks', form);
      setTasks((current) => [data, ...current]);
      setForm((current) => ({ ...current, title: '', description: '', priority: 'medium', status: 'todo' }));
      toast.success('Task created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create task');
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks((current) => current.map((task) => (task._id === taskId ? data : task)));
      toast.success('Task status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update task');
    }
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      project: task.project?._id || '',
      assignee: task.assignee?._id || '',
      priority: task.priority || 'medium',
      status: task.status || 'todo',
    });
  };

  const saveEditTask = async (event) => {
    event.preventDefault();

    if (!editForm.project) {
      toast.error('Select a project before saving changes');
      return;
    }

    try {
      const { data } = await api.put(`/tasks/${editingTask._id}`, editForm);
      setTasks((current) => current.map((task) => (task._id === editingTask._id ? data : task)));
      setEditingTask(null);
      toast.success('Task updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update task');
    }
  };

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm('Delete this task?');

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task._id !== taskId));
      toast.success('Task deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete task');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Tasks</p>
        <h3 className="mt-2 text-3xl font-semibold text-white">Assigned work</h3>
      </div>
      {auth?.user?.role === 'admin' && (
        <form onSubmit={createTask} className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 md:grid-cols-3">
          <input required placeholder="Task title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
          <input placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
          <select value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white">
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
          <select value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white">
            <option value="">Assign later</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>{member.name}</option>
            ))}
          </select>
          <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
          <button disabled={projects.length === 0} className="rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">Create task</button>
        </form>
      )}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xl font-semibold text-white">{task.title}</h4>
                <p className="mt-1 text-sm text-slate-400">{task.project?.name || 'No project'}</p>
                <p className="mt-1 text-sm text-slate-400">Assigned to: {task.assignee?.name || 'Unassigned'}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={task.status}
                  onChange={(event) => updateStatus(task._id, event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {auth?.user?.role === 'admin' && (
                  <>
                    <button type="button" onClick={() => openEditTask(task)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">Edit</button>
                    <button type="button" onClick={() => deleteTask(task._id)} className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20">Delete</button>
                  </>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{task.description || 'No task description.'}</p>
          </div>
        ))}
      </div>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <form onSubmit={saveEditTask} className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Edit task</p>
                <h4 className="mt-2 text-2xl font-semibold text-white">{editingTask.title}</h4>
              </div>
              <button type="button" onClick={() => setEditingTask(null)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">Close</button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input required placeholder="Task title" value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" />
              <select value={editForm.status} onChange={(event) => setEditForm({ ...editForm, status: event.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <input placeholder="Description" value={editForm.description} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2" />
              <select value={editForm.project} onChange={(event) => setEditForm({ ...editForm, project: event.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </select>
              <select value={editForm.assignee} onChange={(event) => setEditForm({ ...editForm, assignee: event.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
                <option value="">Assign later</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
              <select value={editForm.priority} onChange={(event) => setEditForm({ ...editForm, priority: event.target.value })} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white md:col-span-2">
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setEditingTask(null)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white">Cancel</button>
              <button type="submit" className="rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950">Save changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
