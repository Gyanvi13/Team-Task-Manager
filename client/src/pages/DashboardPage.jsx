import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import StatCard from '../components/StatCard';

const DashboardPage = () => {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/analytics/overview');
        setOverview(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load analytics');
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-transparent p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Overview</p>
        <h3 className="mt-3 text-3xl font-semibold text-white">Track team progress without losing the thread.</h3>
        <p className="mt-2 max-w-2xl text-slate-300">Use the dashboard to monitor projects, tasks, and how much work is sitting in each stage.</p>
      </section>
      {overview && (
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Projects" value={overview.totals.projects} hint="Active projects in your workspace" />
          <StatCard label="Tasks" value={overview.totals.tasks} hint="Tasks linked to your team" />
          <StatCard label="Members" value={overview.totals.members} hint="People available to assign work" />
        </section>
      )}
      {overview && (
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h4 className="text-lg font-semibold text-white">Task distribution</h4>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {Object.entries(overview.tasksByStatus).map(([status, count]) => (
              <div key={status} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{status}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{count}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
