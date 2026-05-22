import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectsPage = () => {
  const auth = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', status: 'active', color: '#38bdf8' });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load projects');
      }
    };

    load();
  }, []);

  const createProject = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.post('/projects', form);
      setProjects((current) => [data, ...current]);
      setForm({ name: '', description: '', status: 'active', color: '#38bdf8' });
      toast.success('Project created');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Projects</p>
          <h3 className="mt-2 text-3xl font-semibold text-white">Project boards</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">{projects.length} projects</span>
      </div>
      {auth?.user?.role === 'admin' && (
        <form onSubmit={createProject} className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 md:grid-cols-4">
          <input required placeholder="Project name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
          <input placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white">
            <option value="planning">planning</option>
            <option value="active">active</option>
            <option value="on-hold">on-hold</option>
            <option value="completed">completed</option>
          </select>
          <button className="rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950">Create project</button>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Link key={project._id} to={`/projects/${project._id}`} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-xl font-semibold text-white">{project.name}</h4>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-slate-950" style={{ backgroundColor: project.color || '#7dd3fc' }}>
                {project.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{project.description || 'No description yet.'}</p>
            <p className="mt-5 text-sm text-slate-400">Members: {project.members?.length || 0}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
