import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageCircle, Loader2, Mail, Bell, Send } from 'lucide-react';
import { Communication } from '@/api/entities';
const channelMeta = {
  push: { label: 'Push', icon: Bell, color: 'bg-indigo-100 text-indigo-700' },
  email: { label: 'E-mail', icon: Mail, color: 'bg-amber-100 text-amber-700' },
  sms: { label: 'SMS', icon: MessageCircle, color: 'bg-green-100 text-green-700' },
};
const statusColor = { rascunho: 'bg-slate-100 text-slate-600', enviado: 'bg-green-100 text-green-700', agendado: 'bg-indigo-100 text-indigo-700' };
export default function CommunicationsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Communication.paging({ page: 1, limit: 50, sort: '-created_at' }).then((r) => setData(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const fmt = (iso) => { try { return iso ? new Date(iso).toLocaleDateString('pt-BR') : '—'; } catch { return '—'; } };
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Comunicação</h1>
          <p className="text-slate-500 text-sm mt-0.5">Comunicados por push, e-mail e SMS</p>
        </div>
        <Link to="/admin/communications/create" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA]">
          <Plus className="w-4 h-4" /> Novo comunicado
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200"><MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500">Nenhum comunicado</p></div>
      ) : (
        <div className="space-y-3">
          {data.map((c) => {
            const cm = channelMeta[c.channel] || channelMeta.push;
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cm.color}`}><cm.icon className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{c.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{c.message}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize flex-shrink-0 ${statusColor[c.status] || 'bg-slate-100'}`}>{c.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 pl-13">
                  <span>Segmento: <b className="text-slate-700">{c.segment}</b></span>
                  {c.status === 'enviado' && (
                    <>
                      <span className="flex items-center gap-1"><Send className="w-3.5 h-3.5" /> {c.sentCount} enviados</span>
                      <span>Abertura: <b className="text-slate-700">{c.openRate}%</b></span>
                      <span>Data: {fmt(c.sentAt)}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}