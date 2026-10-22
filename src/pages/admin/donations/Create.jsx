import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Donation, Member, Campaign } from '@/api/entities';
import DatePicker from '@/components/DatePicker';
export default function DonationCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ memberId: '', memberName: '', amount: '', type: 'dizimo', paymentMethod: 'pix', reference: '', campaignId: '', date: new Date().toISOString() });
  const [members, setMembers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    Member.paging({ page: 1, limit: 100 }).then((r) => setMembers(r.data.data || [])).catch(() => {});
    Campaign.paging({ page: 1, limit: 100 }).then((r) => setCampaigns(r.data.data || [])).catch(() => {});
  }, []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const cls = 'w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none';
  const handleMember = (id) => {
    const m = members.find((x) => String(x.id) === String(id));
    setForm((f) => ({ ...f, memberId: id, memberName: m?.name || '' }));
  };
  const handleSave = async () => {
    if (!form.amount || Number(form.amount) <= 0) { setError('Informe um valor válido.'); return; }
    if (saving) return;
    setSaving(true); setError('');
    try {
      await Donation.create({ ...form, amount: Number(form.amount) });
      navigate('/admin/donations');
    } catch (e) { setError('Não foi possível salvar.'); } finally { setSaving(false); }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link to="/admin/donations" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#4F46E5]"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
      <h1 className="text-2xl font-bold text-slate-900 font-display">Registrar contribuição</h1>
      {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4" role="form" aria-label="Formulário de contribuição">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Membro</label>
            <select value={form.memberId} onChange={(e) => handleMember(e.target.value)} className={cls + ' bg-white'}>
              <option value="">Selecione</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$) *</label><input type="number" value={form.amount} onChange={(e) => set('amount', e.target.value)} className={cls} placeholder="0,00" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)} className={cls + ' bg-white'}>
              <option value="dizimo">Dízimo</option>
              <option value="oferta">Oferta</option>
              <option value="campanha">Campanha</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Forma de pagamento</label>
            <select value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className={cls + ' bg-white'}>
              <option value="pix">PIX</option>
              <option value="cartao">Cartão</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="transferencia">Transferência</option>
            </select>
          </div>
          {form.type === 'campanha' && (
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Campanha</label>
              <select value={form.campaignId} onChange={(e) => set('campaignId', e.target.value)} className={cls + ' bg-white'}>
                <option value="">Selecione</option>
                {campaigns.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          )}
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Data</label><DatePicker value={form.date} onChange={(v) => set('date', v)} /></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Referência (culto/evento)</label><input value={form.reference} onChange={(e) => set('reference', e.target.value)} className={cls} /></div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => navigate('/admin/donations')} className="px-5 py-2.5 rounded-lg border border-stone-300 text-slate-700 font-medium hover:bg-slate-50">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA] disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Salvar
          </button>
        </div>
      </div>
    </div>
  );
}