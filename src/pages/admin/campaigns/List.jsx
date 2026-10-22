import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BarChart, Edit, Loader2 } from 'lucide-react';
import { Campaign } from '@/api/entities';
const statusColor = { ativa: 'bg-green-100 text-green-700', encerrada: 'bg-slate-100 text-slate-600', pausada: 'bg-amber-100 text-amber-700' };
export default function CampaignsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Campaign.paging({ page: 1, limit: 50, sort: '-created_at' }).then((r) => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const brl = (v) => 'R$ ' + Number(v || 0).toLocaleString('pt-BR');
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Campanhas</h1>
          <p className="text-slate-500 text-sm mt-0.5">Metas de doação e progresso</p>
        </div>
        <Link to="/admin/campaigns/create" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA]">
          <Plus className="w-4 h-4" /> Nova campanha
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200"><BarChart className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500">Nenhuma campanha</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((c) => {
            const pct = c.goalAmount ? Math.min(100, Math.round((Number(c.raisedAmount) / Number(c.goalAmount)) * 100)) : 0;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900">{c.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[c.status] || 'bg-slate-100'}`}>{c.status}</span>
                </div>
                <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{c.description}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-semibold text-[#4F46E5]">{brl(c.raisedAmount)}</span>
                    <span className="text-slate-400">de {brl(c.goalAmount)}</span>
                  </div>
                  <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#D97706] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">{pct}% da meta alcançada</p>
                </div>
                <Link to={`/admin/campaigns/${c.id}/edit`} className="mt-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#4F46E5]"><Edit className="w-4 h-4" /> Editar</Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}