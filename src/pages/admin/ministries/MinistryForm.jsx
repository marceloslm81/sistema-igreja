import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Ministry } from '@/api/entities';
const empty = { name: '', description: '', leaderName: '', category: 'Serviço', memberCount: 0, requirements: '', imageUrl: '' };
export default function MinistryForm({ initial, ministryId }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (initial) setForm({ ...empty, ...initial }); }, [initial]);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const cls = 'w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none';
  const handleSave = async () => {
    if (!form.name.trim()) { setError('O nome é obrigatório.'); return; }
    if (saving) return;
    setSaving(true); setError('');
    try {
      const payload = { ...form, memberCount: Number(form.memberCount) || 0 };
      if (ministryId) await Ministry.update(ministryId, payload); else await Ministry.create(payload);
      navigate('/admin/ministries');
    } catch (e) { setError('Não foi possível salvar.'); } finally { setSaving(false); }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/admin/ministries" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#4F46E5]"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-slate-900 font-display">{ministryId ? 'Editar ministério' : 'Novo ministério'}</h1>
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4" role="form" aria-label="Formulário de ministério">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label><input value={form.name} onChange={(e) => set('name', e.target.value)} className={cls} /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label><textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={cls + ' resize-none'} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Líder</label><input value={form.leaderName} onChange={(e) => set('leaderName', e.target.value)} className={cls} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={cls + ' bg-white'}>
              {['Adoração', 'Comunicação', 'Educação', 'Serviço', 'Missões', 'Cuidado'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nº de voluntários</label><input type="number" value={form.memberCount} onChange={(e) => set('memberCount', e.target.value)} className={cls} /></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Requisitos</label><textarea value={form.requirements} onChange={(e) => set('requirements', e.target.value)} rows={2} className={cls + ' resize-none'} /></div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => navigate('/admin/ministries')} className="px-5 py-2.5 rounded-lg border border-stone-300 text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA] disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
          </button>
        </div>
      </div>
    </div>
  );
}