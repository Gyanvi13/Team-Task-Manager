import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4 text-center text-slate-100">
    <div className="max-w-lg rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-soft backdrop-blur">
      <p className="text-sm uppercase tracking-[0.35em] text-sky-300">404</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-slate-300">The route you requested does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950">
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
