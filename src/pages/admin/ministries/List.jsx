import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Award, Edit, User, Loader2 } from 'lucide-react';
import { Ministry } from '@/api/entities';
export default function MinistriesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Ministry.paging({ page: 1, limit: 50, sort: '-created_at' }).then((r) => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Ministérios</h1>
          <p className="text-slate-500 text-sm mt-0.5">Áreas de serviço e voluntariado</p>
        </div>
        <Link to="/admin/ministries/create" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA]">
          <Plus className="w-4 h-4" /> Novo ministério
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200"><Award className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500">Nenhum ministério</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              {m.imageUrl ? (
                <div className="h-32 overflow-hidden bg-amber-50"><img src={m.imageUrl} alt="" className="w-full h-full object-cover" /></div>
              ) : (
                <div className="h-32 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center"><Award className="w-10 h-10 text-[#D97706]/40" /></div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{m.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-[#D97706] font-medium">{m.category}</span>
                </div>
                <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{m.description}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-slate-500"><User className="w-4 h-4" /> {m.leaderName}</span>
                  <span className="font-medium text-[#4F46E5]">{m.memberCount || 0} voluntários</span>
                </div>
                <Link to={`/admin/ministries/${m.id}/edit`} className="mt-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#4F46E5]"><Edit className="w-4 h-4" /> Editar</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}