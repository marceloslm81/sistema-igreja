import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Group } from '@/api/entities';
const empty = { name: '', description: '', leaderName: '', meetingDay: 'Terça-feira', meetingTime: '20:00', location: '', address: '', memberCount: 0, healthStatus: 'saudavel', imageUrl: '' };
export default function GroupForm({ initial, groupId }) {
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
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, memberCount: Number(form.memberCount) || 0 };
      if (groupId) await Group.update(groupId, payload); else await Group.create(payload);
      navigate('/admin/groups');
    } catch (e) { setError('Não foi possível salvar.'); } finally { setSaving(false); }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/admin/groups" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#4F46E5]"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-slate-900 font-display">{groupId ? 'Editar célula' : 'Nova célula'}</h1>
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4" role="form" aria-label="Formulário de célula">
        <F label="Nome *"><input value={form.name} onChange={(e) => set('name', e.target.value)} className={cls} placeholder="Nome da célula" /></F>
        <F label="Descrição"><textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className={cls + ' resize-none'} /></F>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <F label="Líder"><input value={form.leaderName} onChange={(e) => set('leaderName', e.target.value)} className={cls} /></F>
          <F label="Nº de membros"><input type="number" value={form.memberCount} onChange={(e) => set('memberCount', e.target.value)} className={cls} /></F>
          <F label="Dia do encontro">
            <select value={form.meetingDay} onChange={(e) => set('meetingDay', e.target.value)} className={cls + ' bg-white'}>
              {['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'].map((d) => <option key={d}>{d}</option>)}
            </select>
          </F>
          <F label="Horário"><input value={form.meetingTime} onChange={(e) => set('meetingTime', e.target.value)} className={cls} placeholder="20:00" /></F>
          <F label="Local"><input value={form.location} onChange={(e) => set('location', e.target.value)} className={cls} /></F>
          <F label="Saúde do grupo">
            <select value={form.healthStatus} onChange={(e) => set('healthStatus', e.target.value)} className={cls + ' bg-white'}>
              <option value="saudavel">Saudável</option>
              <option value="atencao">Atenção</option>
              <option value="critico">Crítico</option>
            </select>
          </F>
        </div>
        <F label="Endereço"><input value={form.address} onChange={(e) => set('address', e.target.value)} className={cls} /></F>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => navigate('/admin/groups')} className="px-5 py-2.5 rounded-lg border border-stone-300 text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA] disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
function F({ label, children }) {
  return <div><label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>{children}</div>;
}