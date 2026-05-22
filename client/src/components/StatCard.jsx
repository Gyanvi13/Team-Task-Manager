const StatCard = ({ label, value, hint }) => (
  <div className="rounded-3xl border border-white/10 bg-white/8 p-5 shadow-soft backdrop-blur">
    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{label}</p>
    <div className="mt-3 text-4xl font-semibold text-white">{value}</div>
    <p className="mt-2 text-sm text-slate-300">{hint}</p>
  </div>
);

export default StatCard;
