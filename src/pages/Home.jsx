import { Link } from 'react-router-dom';
import {
  Users, BarChart, Heart, MessageCircle, Calendar, CreditCard,
  Sparkles, Check, ArrowRight, Star, Building, User, Award
} from 'lucide-react';
import Reveal from '@/components/Reveal';
const FEATURES = [
  { icon: BarChart, title: 'Dashboard Executivo', desc: 'Indicadores em tempo real: membros, frequência, dízimos, eventos e inativos 30/60/90 dias.', img: 'https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/feature-1-85875.png' },
  { icon: Users, title: 'Gestão de Pessoas', desc: 'Cadastro completo com foto, histórico pastoral, famílias, células e busca inteligente.', img: 'https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/feature-2-85875.png' },
  { icon: CreditCard, title: 'Financeiro & Dízimos', desc: 'Dízimos por membro, campanhas de doação online, orçamento e prestação de contas.', img: 'https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/feature-3-85875.png' },
  { icon: Sparkles, title: 'Assistente de IA', desc: 'Rascunhos de comunicados, resumo de atas, sugestões de acompanhamento e relatórios.', img: 'https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/feature-4-85875.png' },
];
const PORTALS = [
  { icon: User, title: 'Portal do Membro', desc: 'Experiência mobile-first: perfil, agenda, grupos, pedidos de oração e doações.', color: 'bg-indigo-50 text-[#4F46E5]' },
  { icon: Award, title: 'Portal do Líder', desc: 'Ministérios, células, escalas, voluntários e acompanhamento do seu grupo.', color: 'bg-amber-50 text-[#D97706]' },
  { icon: Building, title: 'Portal Administrativo', desc: 'Financeiro, patrimônio, documentos, auditoria e relatórios gerenciais.', color: 'bg-violet-50 text-violet-600' },
];
const STATS = [
  { value: '2.500+', label: 'Igrejas atendidas' },
  { value: '98%', label: 'Satisfação de líderes' },
  { value: '40h', label: 'Economizadas por mês' },
  { value: '15', label: 'Módulos integrados' },
];
const TESTIMONIALS = [
  { name: 'Pr. Daniel Moraes', role: 'Igreja Vida Nova', text: 'Reduzimos o tempo de secretaria pela metade. Agora nossa liderança foca no que importa: as pessoas.', img: 'https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/gallery-1-85875.png' },
  { name: 'Cláudia Ramos', role: 'Tesouraria — Comunidade Betel', text: 'A prestação de contas ficou transparente e simples. O relatório mensal é gerado automaticamente.', img: 'https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/gallery-2-85875.png' },
];
const PLANS = [
  { name: 'Semente', price: 'R$ 0', period: '/mês', desc: 'Para igrejas iniciando a organização.', features: ['Até 100 membros', 'Dashboard básico', 'Cadastro de células', 'Suporte por e-mail'], highlight: false },
  { name: 'Tapeçaria', price: 'R$ 149', period: '/mês', desc: 'O plano completo para crescer com ordem.', features: ['Membros ilimitados', 'Todos os módulos', 'Assistente de IA', 'Comunicação SMS/E-mail', 'Doações online'], highlight: true },
  { name: 'Rede', price: 'Sob consulta', period: '', desc: 'Para redes e denominações multi-igreja.', features: ['Multi-tenant', 'Gestão de rede', 'Business Intelligence', 'Onboarding dedicado'], highlight: false },
];
export default function Home() {
  return (
    <div className="w-full">
      {/* HERO — split-half DOMINANT */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -left-32 bottom-0 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 relative">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-[#4F46E5] text-sm font-medium">
                <Sparkles className="w-4 h-4" /> Gestão eclesiástica com inteligência
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 font-display leading-[1.1]">
                Menos administração,<br /><span className="text-[#4F46E5]">mais cuidado pastoral</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto md:mx-0">
                O Church OS entrelaça pessoas, ministérios, finanças e comunicação em uma só plataforma —
                para que líderes dediquem tempo ao que realmente importa.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link to="/admin/login" className="inline-flex items-center justify-center gap-2 bg-[#4F46E5] text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-[#4338CA] transition-colors">
                  Começar agora <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/portal" className="inline-flex items-center justify-center gap-2 bg-white text-[#4F46E5] px-7 py-3.5 rounded-xl font-semibold border-2 border-indigo-200 hover:bg-indigo-50 transition-colors">
                  Ver Portal do Membro
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 justify-center md:justify-start text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Multi-tenant</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> WCAG AA</span>
                <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> LGPD</span>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <Reveal>
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-stone-200 bg-white">
                  <img src="https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/hero-1-85875.png" alt="Painel Church OS" className="w-full h-auto object-cover" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      {/* FEATURES */}
      <section id="recursos" className="w-full bg-white py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">Tudo o que sua igreja precisa</h2>
            <p className="mt-4 text-lg text-slate-600">Módulos integrados que trabalham como fios de uma mesma tapeçaria.</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div className="group bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all h-full">
                  <div className="h-44 overflow-hidden bg-indigo-50">
                    <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {/* PORTALS */}
      <section id="portais" className="w-full bg-indigo-50/40 tapestry-bg py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">Um portal para cada perfil</h2>
            <p className="mt-4 text-lg text-slate-600">Experiências dedicadas para membros, líderes e administradores.</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTALS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 h-full hover:shadow-lg transition-shadow">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${p.color}`}>
                    <p.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-3 text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {/* STATS — quiet */}
      <section className="w-full bg-white py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold text-[#4F46E5] font-display">{s.value}</p>
                <p className="mt-2 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* TESTIMONIALS — image-led */}
      <section className="w-full bg-stone-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">Confiança de quem lidera</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col sm:flex-row h-full">
                  <div className="sm:w-40 h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-indigo-50">
                    <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, k) => <Star key={k} className="w-4 h-4 fill-[#D97706] text-[#D97706]" />)}
                    </div>
                    <p className="text-slate-700 leading-relaxed italic">"{t.text}"</p>
                    <div className="mt-4">
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <p className="text-sm text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {/* PRICING */}
      <section id="planos" className="w-full bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">Planos que crescem com você</h2>
            <p className="mt-4 text-lg text-slate-600">Configuração por igreja, cor e terminologia próprias.</p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08} className="h-full">
                <div className={`rounded-2xl p-8 h-full flex flex-col ${p.highlight ? 'bg-[#1E1B4B] text-white shadow-2xl scale-[1.02]' : 'bg-white border border-stone-200 shadow-sm'}`}>
                  {p.highlight && <span className="self-start px-3 py-1 rounded-full bg-[#D97706] text-white text-xs font-semibold mb-4">Mais popular</span>}
                  <h3 className={`text-lg font-semibold ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className={`text-3xl font-bold font-display ${p.highlight ? 'text-white' : 'text-slate-900'}`}>{p.price}</span>
                    <span className={p.highlight ? 'text-indigo-200' : 'text-slate-400'}>{p.period}</span>
                  </div>
                  <p className={`mt-2 text-sm ${p.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{p.desc}</p>
                  <ul className="mt-6 space-y-3 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-sm ${p.highlight ? 'text-indigo-100' : 'text-slate-600'}`}>
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.highlight ? 'text-[#D97706]' : 'text-green-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/admin/login" className={`mt-8 text-center px-6 py-3 rounded-xl font-semibold transition-colors ${p.highlight ? 'bg-[#D97706] text-white hover:bg-[#B45309]' : 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'}`}>
                    Escolher plano
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      {/* CTA — LOUD */}
      <section className="w-full bg-gradient-to-br from-[#4F46E5] to-[#4338CA] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#D97706]/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-white font-display">Comece a cuidar melhor hoje</h2>
          <p className="mt-5 text-lg text-indigo-100 max-w-2xl mx-auto">
            Experimente o Church OS e transforme a gestão da sua igreja em minutos.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/admin/login" className="inline-flex items-center justify-center gap-2 bg-white text-[#4F46E5] px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
              Acessar plataforma <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-[#D97706] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#B45309] transition-colors">
              Criar conta grátis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}