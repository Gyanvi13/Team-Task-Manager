import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setPayload(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load project');
      }
    };

    load();
  }, [id]);

  if (!payload) {
    return <div className="text-slate-300">Loading project...</div>;
  }

  const { project, tasks } = payload;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Project detail</p>
        <h3 className="mt-2 text-3xl font-semibold text-white">{project.name}</h3>
        <p className="mt-3 max-w-3xl text-slate-300">{project.description || 'No description provided.'}</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h4 className="text-lg font-semibold text-white">Members</h4>
          <div className="mt-4 space-y-3">
            {project.members?.map((member) => (
              <div key={member._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                <div>
                  <p className="font-medium text-white">{member.name}</p>
                  <p className="text-sm text-slate-400">{member.title || member.role}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h4 className="text-lg font-semibold text-white">Tasks</h4>
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{task.title}</p>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{task.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{task.description || 'No task description.'}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailsPage;
