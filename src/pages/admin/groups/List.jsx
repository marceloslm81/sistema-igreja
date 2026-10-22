import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Building, Edit, User, Calendar, Loader2, MapPin } from 'lucide-react';
import { Group } from '@/api/entities';
const healthColor = {
  saudavel: 'bg-green-100 text-green-700',
  atencao: 'bg-amber-100 text-amber-700',
  critico: 'bg-red-100 text-red-700',
};
const healthLabel = { saudavel: 'Saudável', atencao: 'Atenção', critico: 'Crítico' };
export default function GroupsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const res = await Group.paging({ page: 1, limit: 50, sort: '-created_at' });
      setData(res.data.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Células</h1>
          <p className="text-slate-500 text-sm mt-0.5">Pequenos grupos da comunidade</p>
        </div>
        <Link to="/admin/groups/create" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA]">
          <Plus className="w-4 h-4" /> Nova célula
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhuma célula cadastrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((g) => (
            <div key={g.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {g.imageUrl ? (
                <div className="h-32 overflow-hidden bg-indigo-50"><img src={g.imageUrl} alt="" className="w-full h-full object-cover" /></div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center"><Building className="w-10 h-10 text-[#4F46E5]/40" /></div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{g.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${healthColor[g.healthStatus] || 'bg-slate-100 text-slate-600'}`}>{healthLabel[g.healthStatus] || g.healthStatus}</span>
                </div>
                <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{g.description}</p>
                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {g.leaderName}</p>
                  <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {g.meetingDay} · {g.meetingTime}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {g.location}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#4F46E5]">{g.memberCount || 0} membros</span>
                  <Link to={`/admin/groups/${g.id}/edit`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#4F46E5]"><Edit className="w-4 h-4" /> Editar</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}