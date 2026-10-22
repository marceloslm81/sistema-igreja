import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Heart, CreditCard, Calendar, AlertCircle, TrendingUp, ArrowRight, Award
} from 'lucide-react';
import {
  BarChart as RBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { Member, Donation, Event, PrayerRequest, Group } from '@/api/entities';
const attendanceData = [
  { mes: 'Set', freq: 420 }, { mes: 'Out', freq: 445 }, { mes: 'Nov', freq: 460 },
  { mes: 'Dez', freq: 510 }, { mes: 'Jan', freq: 478 }, { mes: 'Fev', freq: 495 },
];
const donationTrend = [
  { mes: 'Set', valor: 42000 }, { mes: 'Out', valor: 45500 }, { mes: 'Nov', valor: 39800 },
  { mes: 'Dez', valor: 58200 }, { mes: 'Jan', valor: 51300 }, { mes: 'Fev', valor: 47600 },
];
const PIE_COLORS = ['#4F46E5', '#D97706', '#818CF8', '#94A3B8'];
export default function Dashboard() {
  const [stats, setStats] = useState({ members: 0, active: 0, inactive: 0, prayersPending: 0, eventsUpcoming: 0, donationsMonth: 0, groups: 0 });
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [mRes, dRes, eRes, pRes, gRes] = await Promise.all([
          Member.paging({ page: 1, limit: 100 }),
          Donation.paging({ page: 1, limit: 100 }),
          Event.paging({ page: 1, limit: 100 }),
          PrayerRequest.paging({ page: 1, limit: 100 }),
          Group.paging({ page: 1, limit: 100 }),
        ]);
        const allMembers = mRes.data.data || [];
        const allDonations = dRes.data.data || [];
        const allPrayers = pRes.data.data || [];
        const allEvents = eRes.data.data || [];
        const now = new Date();
        const monthTotal = allDonations
          .filter((d) => d.date && new Date(d.date).getMonth() === now.getMonth())
          .reduce((s, d) => s + (Number(d.amount) || 0), 0);
        setStats({
          members: allMembers.length,
          active: allMembers.filter((m) => m.status === 'ativo').length,
          inactive: allMembers.filter((m) => m.status === 'inativo').length,
          prayersPending: allPrayers.filter((p) => p.status === 'pendente').length,
          eventsUpcoming: allEvents.filter((e) => e.date && new Date(e.date) >= now).length,
          donationsMonth: allDonations.reduce((s, d) => s + (Number(d.amount) || 0), 0),
          groups: (gRes.data.data || []).length,
        });
        setMembers(allMembers);
        setPrayers(allPrayers.filter((p) => p.status === 'pendente').slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const brl = (v) => 'R$ ' + Number(v || 0).toLocaleString('pt-BR');
  const inactiveMembers = members.filter((m) => m.status === 'inativo');
  const memberTypeData = [
    { name: 'Membros', value: members.filter((m) => m.memberType === 'membro').length },
    { name: 'Congregados', value: members.filter((m) => m.memberType === 'congregado').length },
    { name: 'Visitantes', value: members.filter((m) => m.memberType === 'visitante').length },
  ].filter((d) => d.value > 0);
  const CARDS = [
    { key: 'members', label: 'Total de Membros', value: stats.members, icon: Users, color: 'text-[#4F46E5] bg-indigo-50', link: '/admin/members' },
    { key: 'donations', label: 'Dízimos & Ofertas', value: brl(stats.donationsMonth), icon: CreditCard, color: 'text-[#D97706] bg-amber-50', link: '/admin/donations' },
    { key: 'events', label: 'Próximos Eventos', value: stats.eventsUpcoming, icon: Calendar, color: 'text-violet-600 bg-violet-50', link: '/admin/events' },
    { key: 'prayers', label: 'Orações Pendentes', value: stats.prayersPending, icon: Heart, color: 'text-rose-600 bg-rose-50', link: '/admin/prayers' },
    { key: 'inactive', label: 'Membros Inativos', value: stats.inactive, icon: AlertCircle, color: 'text-amber-600 bg-amber-50', expandable: true },
    { key: 'groups', label: 'Células Ativas', value: stats.groups, icon: Award, color: 'text-emerald-600 bg-emerald-50', link: '/admin/groups' },
  ];
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">Dashboard Executivo</h1>
        <p className="text-slate-500 mt-1">Indicadores em tempo real da sua comunidade.</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-stone-200 p-6">
              <div className="h-10 w-10 bg-slate-200 rounded-xl mb-4" />
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CARDS.map((c) => {
              const Wrapper = c.link ? Link : 'button';
              const props = c.link ? { to: c.link } : { onClick: () => c.expandable && setExpanded(expanded === c.key ? null : c.key), type: 'button' };
              return (
                <div key={c.key}>
                  <Wrapper {...props} className="block w-full text-left bg-white rounded-2xl border border-stone-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className="flex items-start justify-between">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.color}`}>
                        <c.icon className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="mt-4 text-2xl font-bold text-slate-900 font-display">{c.value}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{c.label}</p>
                  </Wrapper>
                  {c.expandable && expanded === c.key && (
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <p className="text-sm font-semibold text-amber-800 mb-2">Requerem acompanhamento pastoral</p>
                      {inactiveMembers.length === 0 ? (
                        <p className="text-sm text-amber-700">Nenhum membro inativo. Excelente!</p>
                      ) : (
                        <div className="space-y-2">
                          {inactiveMembers.map((m) => (
                            <Link key={m.id} to={`/admin/members/${m.id}`} className="flex items-center gap-2 text-sm text-amber-800 hover:underline">
                              <img src={m.avatar} alt="" className="w-6 h-6 rounded-full" />
                              {m.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="font-semibold text-slate-900">Frequência mensal</h3>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <RBarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="freq" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </RBarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-semibold text-slate-900">Tendência de contribuições</h3>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={donationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => brl(v)} />
                  <Line type="monotone" dataKey="valor" stroke="#D97706" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Composição da comunidade</h3>
              {memberTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={memberTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {memberTypeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-slate-400 py-8 text-center">Sem dados</p>}
            </div>
            <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Pedidos de oração pendentes</h3>
                <Link to="/admin/prayers" className="text-sm text-[#4F46E5] font-medium hover:underline">Ver todos</Link>
              </div>
              {prayers.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">Nenhum pedido pendente.</p>
              ) : (
                <div className="space-y-3">
                  {prayers.map((p) => (
                    <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50">
                      <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 text-rose-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{p.subject}</p>
                        <p className="text-xs text-slate-500 truncate">{p.isConfidential ? 'Anônimo' : p.requesterName} · {p.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}