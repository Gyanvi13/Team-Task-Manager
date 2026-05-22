import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TeamPage = () => {
  const auth = useAuth();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', title: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/team');
        setMembers(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load team');
      }
    };

    load();
  }, []);

  const createMember = async (event) => {
    event.preventDefault();

    try {
      const { data } = await api.post('/users', { ...form, role: 'member' });
      setMembers((current) => [data, ...current]);
      setForm({ name: '', email: '', password: '', title: '' });
      toast.success('Member added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add member');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Team</p>
        <h3 className="mt-2 text-3xl font-semibold text-white">Members</h3>
      </div>
      {auth?.user?.role === 'admin' && (
        <form onSubmit={createMember} className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 md:grid-cols-4">
          <input required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
          <input required placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
          <input placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white" />
          <button className="rounded-2xl bg-sky-400 px-4 py-3 font-semibold text-slate-950 md:col-span-4">Add team member</button>
        </form>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <div key={member._id} className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold text-white" style={{ backgroundColor: member.avatarColor || '#1d4ed8' }}>
                {member.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">{member.name}</h4>
                <p className="text-sm text-slate-400">{member.title || 'Team member'}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300">{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
