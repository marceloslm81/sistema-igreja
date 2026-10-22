import { useState, useEffect } from 'react';
import { Heart, Loader2, Lock, Check, Clock, MessageCircle, Save } from 'lucide-react';
import { PrayerRequest } from '@/api/entities';
const statusMeta = {
  pendente: { label: 'Pendente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  em_acompanhamento: { label: 'Em acompanhamento', color: 'bg-indigo-100 text-indigo-700', icon: MessageCircle },
  atendido: { label: 'Atendido', color: 'bg-green-100 text-green-700', icon: Check },
};
export default function PrayersList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [notes, setNotes] = useState({});
  const [savingId, setSavingId] = useState(null);
  const load = async () => {
    setLoading(true);
    try {
      const f = filter ? { status: filter } : {};
      const res = await PrayerRequest.paging({ page: 1, limit: 100, filter: f, sort: '-createdAt' });
      setData(res.data.data || []);
      const n = {};
      (res.data.data || []).forEach((p) => { n[p.id] = p.pastoralNote || ''; });
      setNotes(n);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [filter]);
  const updateStatus = async (id, status) => {
    setSavingId(id);
    try {
      await PrayerRequest.update(id, { status, pastoralNote: notes[id] || '' });
      setData((prev) => prev.map((p) => String(p.id) === String(id) ? { ...p, status, pastoralNote: notes[id] } : p));
    } catch (e) { alert('Erro ao atualizar.'); } finally { setSavingId(null); }
  };
  const fmt = (iso) => { try { return new Date(iso).toLocaleDateString('pt-BR'); } catch { return ''; } };
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Pedidos de Oração</h1>
        <p className="text-slate-500 text-sm mt-0.5">Acompanhamento pastoral confidencial</p>
      </div>
      <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {[{ v: '', l: 'Todos' }, { v: 'pendente', l: 'Pendentes' }, { v: 'em_acompanhamento', l: 'Em acompanhamento' }, { v: 'atendido', l: 'Atendidos' }].map((t) => (
          <button key={t.v} onClick={() => setFilter(t.v)} className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium ${filter === t.v ? 'bg-[#4F46E5] text-white' : 'bg-white border border-stone-200 text-slate-600 hover:bg-slate-50'}`}>{t.l}</button>
        ))}
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200"><Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500">Nenhum pedido</p></div>
      ) : (
        <div className="space-y-4">
          {data.map((p) => {
            const meta = statusMeta[p.status] || statusMeta.pendente;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0"><Heart className="w-5 h-5 text-rose-500" /></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{p.subject}</h3>
                        {p.isConfidential && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                      <p className="text-xs text-slate-400">{p.isConfidential ? 'Anônimo' : p.requesterName} · {p.category} · {fmt(p.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 flex-shrink-0 ${meta.color}`}><meta.icon className="w-3 h-3" /> {meta.label}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{p.content}</p>
                <div className="mt-4 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <label className="text-xs font-semibold text-[#4F46E5] flex items-center gap-1 mb-1.5"><Lock className="w-3 h-3" /> Nota pastoral (confidencial)</label>
                  <textarea
                    value={notes[p.id] || ''}
                    onChange={(e) => setNotes((n) => ({ ...n, [p.id]: e.target.value }))}
                    rows={2}
                    placeholder="Registre o acompanhamento..."
                    className="w-full px-3 py-2 rounded-lg border border-indigo-200 text-sm bg-white focus:border-[#4F46E5] outline-none resize-none"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.id, e.target.value)}
                    disabled={savingId === p.id}
                    className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white outline-none"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_acompanhamento">Em acompanhamento</option>
                    <option value="atendido">Atendido</option>
                  </select>
                  <button onClick={() => updateStatus(p.id, p.status)} disabled={savingId === p.id} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4F46E5] text-white text-sm font-medium hover:bg-[#4338CA] disabled:opacity-60">
                    {savingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar nota
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}