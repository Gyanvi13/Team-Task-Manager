import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@teamtask.local');
  const [password, setPassword] = useState('password123');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await auth.login(email, password);
        toast.success('Welcome back');
      } else {
        await auth.signup(name, email, password);
        toast.success('Account created');
      }
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-soft backdrop-blur">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300">Team Task Manager</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p className="mt-2 text-sm text-slate-300">
          {mode === 'login'
            ? 'Use your admin or member account to manage projects and tasks.'
            : 'Create a member account to get started with the workspace.'}
        </p>
        <div className="mt-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1 text-sm text-slate-300">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-xl px-4 py-2 transition ${mode === 'login' ? 'bg-sky-400 text-slate-950' : 'hover:text-white'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-xl px-4 py-2 transition ${mode === 'signup' ? 'bg-sky-400 text-slate-950' : 'hover:text-white'}`}
          >
            Sign up
          </button>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="block">
              <span className="text-sm text-slate-300">Full name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400"
                placeholder="Your name"
              />
            </label>
          )}
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 focus:border-sky-400"
            />
          </label>
          <button disabled={submitting} className="w-full rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 disabled:opacity-60">
            {submitting ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : mode === 'login' ? 'Login' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
