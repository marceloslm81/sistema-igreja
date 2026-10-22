import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, ArrowLeft, Upload } from 'lucide-react';
import { Member, Group } from '@/api/entities';
import { vibex } from '@/api/vibexClient';
import DatePicker from '@/components/DatePicker';
import { Link } from 'react-router-dom';
const empty = {
  name: '', email: '', phone: '', avatar: '', address: '', city: '',
  birthDate: '', baptismDate: '', joinDate: '', status: 'ativo',
  memberType: 'membro', gender: '', maritalStatus: '', howArrived: '',
  groupId: '', ministryNames: [], pastoralNotes: '',
};
export default function MemberForm({ initial, memberId }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [groups, setGroups] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (initial) setForm({ ...empty, ...initial, ministryNames: initial.ministryNames || [] });
  }, [initial]);
  useEffect(() => {
    Group.paging({ page: 1, limit: 100 }).then((r) => setGroups(r.data.data || [])).catch(() => {});
  }, []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await vibex.integrations.Core.UploadFile({ file, folder: 'images' });
      const url = res?.data?.file_url;
      if (url) set('avatar', url);
    } catch (err) {
      setError('Falha no upload da imagem.');
    } finally {
      setUploading(false);
    }
  };
  const handleSave = async () => {
    if (!form.name.trim()) { setError('O nome é obrigatório.'); return; }
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, lastActivityDate: form.status === 'ativo' ? new Date().toISOString() : form.lastActivityDate };
      if (memberId) {
        await Member.update(memberId, payload);
      } else {
        await Member.create(payload);
      }
      navigate('/admin/members');
    } catch (err) {
      setError('Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };
  const inputCls = 'w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none';
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link to="/admin/members" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#4F46E5]">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 font-display">{memberId ? 'Editar membro' : 'Novo membro'}</h1>
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5" role="form" aria-label="Formulário de membro">
        <div className="flex items-center gap-4">
          <img src={form.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=novo'} alt="" className="w-16 h-16 rounded-2xl bg-slate-100 object-cover" />
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 text-sm cursor-pointer hover:bg-slate-50">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Enviar foto
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome completo *"><input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder="Nome do membro" /></Field>
          <Field label="E-mail"><input value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} placeholder="email@exemplo.com" /></Field>
          <Field label="Telefone"><input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="+55 11 90000-0000" /></Field>
          <Field label="Cidade"><input value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} placeholder="Cidade" /></Field>
          <Field label="Endereço" full><input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputCls} placeholder="Rua, número, bairro" /></Field>
          <Field label="Tipo">
            <select value={form.memberType} onChange={(e) => set('memberType', e.target.value)} className={inputCls + ' bg-white'}>
              <option value="membro">Membro</option>
              <option value="congregado">Congregado</option>
              <option value="visitante">Visitante</option>
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputCls + ' bg-white'}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="transferido">Transferido</option>
              <option value="falecido">Falecido</option>
            </select>
          </Field>
          <Field label="Gênero">
            <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputCls + ' bg-white'}>
              <option value="">Selecione</option>
              <option>Masculino</option>
              <option>Feminino</option>
            </select>
          </Field>
          <Field label="Estado civil">
            <select value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value)} className={inputCls + ' bg-white'}>
              <option value="">Selecione</option>
              <option>Solteiro</option>
              <option>Casado</option>
              <option>Divorciado</option>
              <option>Viúvo</option>
            </select>
          </Field>
          <Field label="Data de nascimento"><DatePicker value={form.birthDate} onChange={(v) => set('birthDate', v)} /></Field>
          <Field label="Data de ingresso"><DatePicker value={form.joinDate} onChange={(v) => set('joinDate', v)} /></Field>
          <Field label="Data de batismo"><DatePicker value={form.baptismDate} onChange={(v) => set('baptismDate', v)} /></Field>
          <Field label="Célula">
            <select value={form.groupId} onChange={(e) => set('groupId', e.target.value)} className={inputCls + ' bg-white'}>
              <option value="">Sem célula</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </Field>
          <Field label="Como chegou"><input value={form.howArrived} onChange={(e) => set('howArrived', e.target.value)} className={inputCls} placeholder="Convite, redes sociais..." /></Field>
          <Field label="Ministérios (separados por vírgula)">
            <input
              value={(form.ministryNames || []).join(', ')}
              onChange={(e) => set('ministryNames', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              className={inputCls}
              placeholder="Louvor, Diaconia"
            />
          </Field>
          <Field label="Notas pastorais (confidencial)" full>
            <textarea value={form.pastoralNotes} onChange={(e) => set('pastoralNotes', e.target.value)} rows={3} className={inputCls + ' resize-none'} placeholder="Observações confidenciais" />
          </Field>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => navigate('/admin/members')} className="px-5 py-2.5 rounded-lg border border-stone-300 text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA] disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children, full }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}