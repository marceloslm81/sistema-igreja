import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Campaign } from '@/api/entities';
import DatePicker from '@/components/DatePicker';
const empty = { title: '', description: '', goalAmount: '', raisedAmount: 0, deadline: '', status: 'ativa', imageUrl: '' };
export default function CampaignForm({ initial, campaignId }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (initial) setForm({ ...empty, ...initial }); }, [initial]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const cls = 'w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none';
  const handleSave = async () => {
    if (!form.title.trim()) { setError('O título é obrigatório.'); return; }
    if (!form.goalAmount || Number(form.goalAmount) <= 0) { setError('Informe a meta financeira.'); return; }
    if (saving) return;
    setSaving(true); setError('');
    try {
      const payload = { ...form, goalAmount: Number(form.goalAmount), raisedAmount: Number(form.raisedAmount) || 0 };
      if (campaignId) await Campaign.update(campaignId, payload); else await Campaign.create(payload);
      navigate('/admin/campaigns');
    } catch (e) { setError('Não foi possível salvar.'); } finally { setSaving(false); }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/admin/campaigns" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#4F46E5]"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-slate-900 font-display">{campaignId ? 'Editar campanha' : 'Nova campanha'}</h1>
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4" role="form" aria-label="Formulário de campanha">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Título *</label><input value={form.title} onChange={(e) => set('title', e.target.value)} className={cls} /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label><textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={cls + ' resize-none'} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Meta (R$) *</label><input type="number" value={form.goalAmount} onChange={(e) => set('goalAmount', e.target.value)} className={cls} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Arrecadado (R$)</label><input type="number" value={form.raisedAmount} onChange={(e) => set('raisedAmount', e.target.value)} className={cls} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Prazo final</label><DatePicker value={form.deadline} onChange={(v) => set('deadline', v)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={cls + ' bg-white'}>
              <option value="ativa">Ativa</option>
              <option value="pausada">Pausada</option>
              <option value="encerrada">Encerrada</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => navigate('/admin/campaigns')} className="px-5 py-2.5 rounded-lg border border-stone-300 text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA] disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
          </button>
        </div>
      </div>
    </div>
  );
}