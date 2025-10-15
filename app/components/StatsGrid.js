import { Eye, FileText, ThumbsUp, Users } from 'lucide-react';

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon || Eye;
        return (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10`}>
                <Icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <span className="text-sm text-slate-400">{stat.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}