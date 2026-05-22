import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const statusLabels = {
  todo: 'To do',
  'in-progress': 'In progress',
  review: 'In review',
  done: 'Done',
};

const formatDate = (value) => {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
};

const MemberDashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksResponse, projectsResponse] = await Promise.all([api.get('/tasks'), api.get('/projects')]);
        setTasks(tasksResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load member dashboard');
      }
    };

    load();
  }, []);

  const assignedTasks = useMemo(() => tasks.filter((task) => task.assignee), [tasks]);
  const dueTodayTasks = useMemo(
    () =>
      assignedTasks.filter((task) => {
        if (!task.dueDate || task.status === 'done') {
          return false;
        }

        const dueDate = new Date(task.dueDate);
        const today = new Date();

        return (
          dueDate.getFullYear() === today.getFullYear() &&
          dueDate.getMonth() === today.getMonth() &&
          dueDate.getDate() === today.getDate()
        );
      }),
    [assignedTasks]
  );
  const upcomingTasks = useMemo(
    () =>
      assignedTasks.filter((task) => {
        if (!task.dueDate || task.status === 'done') {
          return false;
        }

        return new Date(task.dueDate) > new Date();
      }),
    [assignedTasks]
  );
  const overdueTasks = useMemo(
    () =>
      assignedTasks.filter((task) => {
        if (!task.dueDate || task.status === 'done') {
          return false;
        }

        return new Date(task.dueDate) < new Date();
      }),
    [assignedTasks]
  );
  const activeProjects = useMemo(() => projects.filter((project) => project.status !== 'done'), [projects]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-transparent p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Member dashboard</p>
        <h3 className="mt-3 text-3xl font-semibold text-white">Track your assigned work and deadlines.</h3>
        <p className="mt-2 max-w-2xl text-slate-300">Focus on your tasks, upcoming due dates, and the projects you are part of.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Assigned tasks</p>
          <p className="mt-3 text-3xl font-semibold text-white">{assignedTasks.length}</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Due today</p>
          <p className="mt-3 text-3xl font-semibold text-white">{dueTodayTasks.length}</p>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Overdue tasks</p>
          <p className="mt-3 text-3xl font-semibold text-white">{overdueTasks.length}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
          <h4 className="text-lg font-semibold text-white">Due today</h4>
          <div className="mt-4 space-y-3">
            {dueTodayTasks.length === 0 && <p className="text-sm text-amber-50/70">No tasks due today.</p>}
            {dueTodayTasks.map((task) => (
              <div key={task._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="font-medium text-white">{task.title}</p>
                <p className="mt-1 text-sm text-amber-50/80">Project: {task.project?.name || 'No project'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h4 className="text-lg font-semibold text-white">Upcoming tasks</h4>
          <div className="mt-4 space-y-3">
            {upcomingTasks.length === 0 && <p className="text-sm text-slate-400">No upcoming tasks right now.</p>}
            {upcomingTasks.map((task) => (
              <div key={task._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{task.title}</p>
                    <p className="text-sm text-slate-400">{task.project?.name || 'No project'}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                    {statusLabels[task.status] || task.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-300">Due: {formatDate(task.dueDate)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h4 className="text-lg font-semibold text-white">Overdue tasks</h4>
          <div className="mt-4 space-y-3">
            {overdueTasks.length === 0 && <p className="text-sm text-slate-400">No overdue work right now.</p>}
            {overdueTasks.map((task) => (
              <div key={task._id} className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
                <p className="font-medium text-white">{task.title}</p>
                <p className="mt-1 text-sm text-rose-100/80">Project: {task.project?.name || 'No project'}</p>
                <p className="mt-1 text-sm text-rose-100/80">Due: {formatDate(task.dueDate)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <h4 className="text-lg font-semibold text-white">All assigned tasks</h4>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {assignedTasks.length === 0 && <p className="text-sm text-slate-400">No tasks assigned yet.</p>}
          {assignedTasks.map((task) => (
            <div key={task._id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white">{task.title}</p>
                  <p className="text-sm text-slate-400">{task.project?.name || 'No project'}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                  {statusLabels[task.status] || task.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">Due: {formatDate(task.dueDate)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MemberDashboardPage;