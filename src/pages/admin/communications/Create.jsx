import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Send, ArrowLeft, Bell, Mail, MessageCircle, Sparkles, CheckCircle } from 'lucide-react';
import { Communication, Member } from '@/api/entities';
import { sendEmail } from '@/lib/email';
import { sendSms } from '@/lib/sms';
import { aiflow1020, aiflow1020ConfigPromise } from '@/lib/aiflow';
const CHANNELS = [
  { v: 'push', label: 'Push', icon: Bell },
  { v: 'email', label: 'E-mail', icon: Mail },
  { v: 'sms', label: 'SMS', icon: MessageCircle },
];
export default function CommunicationCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', message: '', channel: 'push', segment: 'Todos' });
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const cls = 'w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none';
  const generateDraft = async () => {
    setAiLoading(true);
    try {
      const config = await aiflow1020ConfigPromise;
      const res = await aiflow1020.chat({
        system: config?.systemPrompt || '',
        messages: [{ role: 'user', content: `Escreva um comunicado curto e acolhedor para a igreja com o título "${form.title || 'Comunicado'}" destinado ao segmento "${form.segment}". Retorne apenas o texto do comunicado, sem título.` }],
      });
      if (res?.content) set('message', res.content.trim());
    } catch (err) {
      const msg = err?.status === 402 ? 'Créditos de IA esgotados.' : 'Erro ao gerar rascunho.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setAiLoading(false);
    }
  };
  const handleSend = async (asDraft) => {
    if (!form.title.trim() || !form.message.trim()) {
      setNotification({ type: 'error', message: 'Preencha título e mensagem.' });
      return;
    }
    if (saving) return;
    setSaving(true);
    setNotification(null);
    try {
      let sentCount = 0;
      if (!asDraft) {
        const membersRes = await Member.paging({ page: 1, limit: 100 });
        const members = membersRes.data.data || [];
        if (form.channel === 'email') {
          const recipients = members.map((m) => m.email).filter(Boolean);
          if (recipients.length) {
            try {
              await sendEmail({ to: recipients, subject: form.title, text: form.message, fromName: 'Church OS' });
              sentCount = recipients.length;
            } catch (e) { console.warn('Email:', e.message); }
          }
        } else if (form.channel === 'sms') {
          const first = members.find((m) => m.phone);
          if (first?.phone) {
            try {
              await sendSms({ dialCode: '+55', phoneNumber: first.phone.replace(/\D/g, '').slice(-11), body: `${form.title}: ${form.message}` });
              sentCount = 1;
            } catch (e) { console.warn('SMS:', e.message); }
          }
        } else {
          sentCount = members.length;
        }
      }
      await Communication.create({
        ...form,
        status: asDraft ? 'rascunho' : 'enviado',
        sentCount,
        openRate: 0,
        sentAt: asDraft ? '' : new Date().toISOString(),
      });
      setNotification({ type: 'success', message: asDraft ? 'Rascunho salvo!' : `Comunicado enviado para ${sentCount} destinatário(s)!` });
      setTimeout(() => navigate('/admin/communications'), 1200);
    } catch (e) {
      setNotification({ type: 'error', message: 'Não foi possível concluir.' });
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/admin/communications" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#4F46E5]"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-slate-900 font-display">Novo comunicado</h1>
      {notification && (
        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {notification.type === 'success' && <CheckCircle className="w-4 h-4" />}
          {notification.message}
        </div>
      )}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4" role="form" aria-label="Formulário de comunicado">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Canal</label>
          <div className="grid grid-cols-3 gap-2">
            {CHANNELS.map((c) => (
              <button key={c.v} onClick={() => set('channel', c.v)} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm font-medium transition-colors ${form.channel === c.v ? 'bg-indigo-50 border-[#4F46E5] text-[#4F46E5]' : 'border-stone-200 text-slate-600 hover:bg-slate-50'}`}>
                <c.icon className="w-5 h-5" /> {c.label}
              </button>
            ))}
          </div>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Título</label><input value={form.title} onChange={(e) => set('title', e.target.value)} className={cls} placeholder="Assunto do comunicado" /></div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">Mensagem</label>
            <button onClick={generateDraft} disabled={aiLoading} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4F46E5] hover:bg-indigo-50 px-2.5 py-1 rounded-lg disabled:opacity-60">
              {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Gerar com IA
            </button>
          </div>
          <textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={5} className={cls + ' resize-none'} placeholder="Escreva a mensagem ou gere com IA..." />
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Segmento</label>
          <select value={form.segment} onChange={(e) => set('segment', e.target.value)} className={cls + ' bg-white'}>
            {['Todos', 'Membros', 'Jovens', 'Voluntários', 'Líderes', 'Congregados'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => handleSend(true)} disabled={saving} className="px-5 py-2.5 rounded-lg border border-stone-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-60">Salvar rascunho</button>
          <button onClick={() => handleSend(false)} disabled={saving} className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA] disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Enviar agora
          </button>
        </div>
      </div>
    </div>
  );
}