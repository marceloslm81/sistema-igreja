import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Edit, MapPin, User, Users, Loader2 } from 'lucide-react';
import { Event } from '@/api/entities';
const statusColor = {
  agendado: 'bg-indigo-100 text-indigo-700',
  confirmado: 'bg-green-100 text-green-700',
  concluido: 'bg-slate-100 text-slate-600',
  cancelado: 'bg-red-100 text-red-700',
};
export default function EventsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Event.paging({ page: 1, limit: 50, sort: 'date' }).then((r) => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const fmt = (iso) => { try { return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch { return iso; } };
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Eventos</h1>
          <p className="text-slate-500 text-sm mt-0.5">Agenda unificada da igreja</p>
        </div>
        <Link to="/admin/events/create" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA]">
          <Plus className="w-4 h-4" /> Novo evento
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200"><Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500">Nenhum evento</p></div>
      ) : (
        <div className="space-y-3">
          {data.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 flex flex-col items-center justify-center text-[#4F46E5] flex-shrink-0">
                <span className="text-[10px] uppercase font-bold">{e.date ? new Date(e.date).toLocaleDateString('pt-BR', { month: 'short' }) : ''}</span>
                <span className="text-xl font-bold leading-none">{e.date ? new Date(e.date).getDate() : '--'}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{e.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColor[e.status] || 'bg-slate-100 text-slate-600'}`}>{e.status}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {fmt(e.date)}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {e.location}</span>
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {e.responsible}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {e.registeredCount || 0}{e.capacity ? `/${e.capacity}` : ''}</span>
                </div>
              </div>
              <Link to={`/admin/events/${e.id}/edit`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-[#4F46E5] self-start sm:self-center"><Edit className="w-4 h-4" /> Editar</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}