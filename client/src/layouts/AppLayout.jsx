import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `rounded-2xl px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-sky-400 text-slate-950' : 'text-slate-300 hover:bg-white/10'}`;

const AppLayout = () => {
  const auth = useAuth();

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 p-4 md:p-6">
        <aside className="hidden w-72 shrink-0 flex-col rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-soft backdrop-blur md:flex">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-sky-300">Team Task Manager</div>
            <h1 className="mt-3 text-3xl font-semibold text-white">Mini Jira for lean teams</h1>
            <p className="mt-3 text-sm text-slate-300">Projects, tasks, members, and analytics in one focused workspace.</p>
          </div>
          <nav className="mt-8 flex flex-col gap-2">
            <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
            <NavLink to="/projects" className={linkClass}>Projects</NavLink>
            <NavLink to="/tasks" className={linkClass}>Tasks</NavLink>
            <NavLink to="/team" className={linkClass}>Team</NavLink>
          </nav>
          <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Signed in as</p>
            <p className="mt-2 text-lg font-medium text-white">{auth?.user?.name}</p>
            <p className="text-sm text-slate-300">{auth?.user?.role}</p>
          </div>
        </aside>
        <main className="flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/50 shadow-soft backdrop-blur">
          <div className="border-b border-white/10 px-4 py-4 md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Workspace</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{auth?.user?.role === 'admin' ? 'Admin control center' : 'Member dashboard'}</h2>
              </div>
              <button
                type="button"
                onClick={auth?.logout}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
