import { useState, useEffect } from 'react';
import {
  User, Calendar, Users, Heart, CreditCard, Bell, MapPin, Clock,
  Send, Loader2, CheckCircle
} from 'lucide-react';
import { Member, Event, Group, PrayerRequest } from '@/api/entities';
import CheckoutButton from '@/components/CheckoutButton';
const TABS = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'grupos', label: 'Grupos', icon: Users },
  { id: 'oracao', label: 'Oração', icon: Heart },
  { id: 'doar', label: 'Doar', icon: CreditCard },
];
const statusColor = {
  ativo: 'bg-green-100 text-green-700',
  inativo: 'bg-amber-100 text-amber-700',
  transferido: 'bg-slate-100 text-slate-600',
  falecido: 'bg-slate-100 text-slate-600',
};
export default function MemberPortal() {
  const [tab, setTab] = useState('perfil');
  const [member, setMember] = useState(null);
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prayerForm, setPrayerForm] = useState({ subject: '', content: '', category: 'Pessoal', isConfidential: false });
  const [prayerSending, setPrayerSending] = useState(false);
  const [prayerSent, setPrayerSent] = useState(false);
  const [donationAmount, setDonationAmount] = useState(50);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [mRes, eRes, gRes] = await Promise.all([
          Member.paging({ page: 1, limit: 1, sort: '-created_at' }),
          Event.paging({ page: 1, limit: 5, sort: 'date' }),
          Group.paging({ page: 1, limit: 4 }),
        ]);
        setMember(mRes.data.data?.[0] || null);
        setEvents(eRes.data.data || []);
        setGroups(gRes.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const submitPrayer = async () => {
    if (!prayerForm.subject.trim() || !prayerForm.content.trim() || prayerSending) return;
    setPrayerSending(true);
    try {
      await PrayerRequest.create({
        requesterName: prayerForm.isConfidential ? 'Anônimo' : (member?.name || 'Membro'),
        requesterEmail: member?.email || '',
        subject: prayerForm.subject,
        content: prayerForm.content,
        category: prayerForm.category,
        status: 'pendente',
        isConfidential: prayerForm.isConfidential,
        createdAt: new Date().toISOString(),
      });
      setPrayerSent(true);
      setPrayerForm({ subject: '', content: '', category: 'Pessoal', isConfidential: false });
      setTimeout(() => setPrayerSent(false), 4000);
    } catch (e) {
      alert('Não foi possível enviar o pedido: ' + e.message);
    } finally {
      setPrayerSending(false);
    }
  };
  const fmtDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  };
  return (
    <div className="w-full bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="w-full bg-gradient-to-br from-[#4F46E5] to-[#4338CA] text-white">
        <div className="max-w-3xl mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm">Portal do Membro</p>
              <h1 className="text-2xl font-bold font-display mt-0.5">
                {loading ? 'Carregando...' : `Olá, ${member?.name?.split(' ')[0] || 'Membro'}`}
              </h1>
            </div>
            <button className="relative w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#D97706] rounded-full" />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 -mt-3">
        {/* Tab bar */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-1.5 flex overflow-x-auto gap-1 [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 min-w-[64px] flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                tab === t.id ? 'bg-indigo-50 text-[#4F46E5]' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <t.icon className="w-5 h-5" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="py-6 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl border border-stone-200 p-6">
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {tab === 'perfil' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex items-center gap-4">
                    <img src={member?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=member'} alt="" className="w-16 h-16 rounded-2xl object-cover bg-indigo-50" />
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-slate-900">{member?.name || 'Membro'}</h2>
                      <p className="text-sm text-slate-500">{member?.email || '—'}</p>
                      <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusColor[member?.status] || 'bg-slate-100 text-slate-600'}`}>
                        {member?.memberType || 'membro'} · {member?.status || 'ativo'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard label="Telefone" value={member?.phone || '—'} />
                    <InfoCard label="Cidade" value={member?.city || '—'} />
                    <InfoCard label="Ingresso" value={member?.joinDate ? new Date(member.joinDate).toLocaleDateString('pt-BR') : '—'} />
                    <InfoCard label="Batismo" value={member?.baptismDate ? new Date(member.baptismDate).toLocaleDateString('pt-BR') : 'Pendente'} />
                  </div>
                  {member?.ministryNames?.length > 0 && (
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                      <p className="text-sm font-semibold text-slate-900 mb-2">Ministérios</p>
                      <div className="flex flex-wrap gap-2">
                        {member.ministryNames.map((m) => (
                          <span key={m} className="text-xs px-3 py-1 rounded-full bg-amber-50 text-[#D97706] font-medium">{m}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {tab === 'agenda' && (
                <div className="space-y-3">
                  {events.length === 0 ? (
                    <EmptyState icon={Calendar} text="Nenhum evento agendado" />
                  ) : events.map((e) => (
                    <div key={e.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex flex-col items-center justify-center text-[#4F46E5] flex-shrink-0">
                          <span className="text-[10px] uppercase font-bold">{e.date ? new Date(e.date).toLocaleDateString('pt-BR', { month: 'short' }) : ''}</span>
                          <span className="text-lg font-bold leading-none">{e.date ? new Date(e.date).getDate() : '--'}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{e.title}</h3>
                          <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {fmtDate(e.date)}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {e.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'grupos' && (
                <div className="space-y-3">
                  {groups.length === 0 ? (
                    <EmptyState icon={Users} text="Nenhum grupo disponível" />
                  ) : groups.map((g) => (
                    <div key={g.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">{g.name}</h3>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] font-medium">{g.memberCount || 0} membros</span>
                      </div>
                      <p className="mt-1.5 text-sm text-slate-500">{g.description}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {g.leaderName}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {g.meetingDay} {g.meetingTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'oracao' && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6" role="form" aria-label="Enviar pedido de oração">
                  <h2 className="text-lg font-semibold text-slate-900">Enviar pedido de oração</h2>
                  <p className="text-sm text-slate-500 mt-1">Nossa equipe pastoral vai acompanhar com cuidado e confidencialidade.</p>
                  {prayerSent && (
                    <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Pedido enviado! Estamos orando por você.
                    </div>
                  )}
                  <div className="mt-4 space-y-3">
                    <input
                      value={prayerForm.subject}
                      onChange={(e) => setPrayerForm((f) => ({ ...f, subject: e.target.value }))}
                      placeholder="Assunto"
                      className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                    <select
                      value={prayerForm.category}
                      onChange={(e) => setPrayerForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm bg-white focus:border-[#4F46E5] outline-none"
                    >
                      <option>Pessoal</option>
                      <option>Saúde</option>
                      <option>Família</option>
                      <option>Trabalho</option>
                      <option>Gratidão</option>
                      <option>Missões</option>
                    </select>
                    <textarea
                      value={prayerForm.content}
                      onChange={(e) => setPrayerForm((f) => ({ ...f, content: e.target.value }))}
                      placeholder="Escreva seu pedido..."
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="checkbox" checked={prayerForm.isConfidential} onChange={(e) => setPrayerForm((f) => ({ ...f, isConfidential: e.target.checked }))} className="rounded" />
                      Enviar de forma anônima e confidencial
                    </label>
                    <button
                      onClick={submitPrayer}
                      disabled={prayerSending}
                      className="w-full bg-[#4F46E5] text-white py-3 rounded-xl font-semibold hover:bg-[#4338CA] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {prayerSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Enviar pedido
                    </button>
                  </div>
                </div>
              )}
              {tab === 'doar' && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900">Dízimos e ofertas online</h2>
                  <p className="text-sm text-slate-500 mt-1">Contribua com segurança via cartão de crédito.</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[50, 100, 200, 300, 500, 1000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setDonationAmount(v)}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                          donationAmount === v ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white text-slate-700 border-stone-300 hover:border-[#4F46E5]'
                        }`}
                      >
                        R$ {v}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="text-sm text-slate-600">Outro valor (R$)</label>
                    <input
                      type="number"
                      min="1"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(Number(e.target.value))}
                      className="mt-1 w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                  <div className="mt-5">
                    <CheckoutButton amount={donationAmount} currency="brl" label={`Doar R$ ${donationAmount}`} reference="Dízimo/Oferta online" type="oferta" />
                  </div>
                  <p className="mt-3 text-xs text-slate-400 text-center">Pagamento seguro processado via Stripe.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
function InfoCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}
function EmptyState({ icon: Icon, text }) {
  return (
    <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
      <Icon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 text-sm">{text}</p>
    </div>
  );
}