import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Users } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';
const NAV = [
  { to: '/', label: 'Início' },
  { to: '/#recursos', label: 'Recursos' },
  { to: '/#portais', label: 'Portais' },
  { to: '/#planos', label: 'Planos' },
  { to: '/portal', label: 'Portal do Membro' },
];
export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <header className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-sm border-b border-stone-100' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img src="https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/logo-0-85875.png" alt="Church OS" className="h-9 w-auto object-contain" />
            </Link>
            <nav className="hidden md:flex items-center gap-7">
              {NAV.map((n) => (
                <a key={n.label} href={n.to} className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors">
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-[#4F46E5] px-4 py-2 rounded-lg hover:bg-indigo-50">
                Entrar
              </Link>
              <Link to="/admin/login" className="text-sm font-semibold bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg hover:bg-[#4338CA] transition-colors">
                Acesso Admin
              </Link>
            </div>
            <button className="md:hidden p-2 text-slate-700" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1">
            {NAV.map((n) => (
              <a key={n.label} href={n.to} className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium">
                {n.label}
              </a>
            ))}
            <div className="pt-2 flex gap-2">
              <Link to="/login" className="flex-1 text-center text-sm font-semibold text-[#4F46E5] px-4 py-2.5 rounded-lg border border-indigo-200">Entrar</Link>
              <Link to="/admin/login" className="flex-1 text-center text-sm font-semibold bg-[#4F46E5] text-white px-4 py-2.5 rounded-lg">Admin</Link>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-[#1E1B4B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <img src="https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/logo-0-85875.png" alt="Church OS" className="h-9 w-auto object-contain" style={{ filter: 'brightness(100) invert(30%)' }} />
              <p className="mt-4 text-sm text-indigo-200/70 leading-relaxed max-w-xs">
                Menos administração, mais cuidado pastoral. A plataforma que entrelaça toda a sua comunidade.
              </p>
            </div>
            <div className="hidden md:block">
              <h4 className="font-semibold mb-3 text-sm">Plataforma</h4>
              <ul className="space-y-2 text-sm text-indigo-200/70">
                <li><a href="/#recursos" className="hover:text-white">Recursos</a></li>
                <li><a href="/#portais" className="hover:text-white">Portais</a></li>
                <li><a href="/#planos" className="hover:text-white">Planos</a></li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="font-semibold mb-3 text-sm">Comunidade</h4>
              <ul className="space-y-2 text-sm text-indigo-200/70">
                <li><Link to="/portal" className="hover:text-white">Portal do Membro</Link></li>
                <li><Link to="/login" className="hover:text-white">Entrar</Link></li>
                <li><Link to="/register" className="hover:text-white">Criar conta</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Contato</h4>
              <p className="text-sm text-indigo-200/70">contato@churchos.app · (11) 4000-0000</p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-indigo-900/50 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-indigo-200/60">© 2026 Church OS. Todos os direitos reservados.</p>
            <Link to="/admin/login" className="text-xs text-indigo-300/50 hover:text-indigo-200">Administrador</Link>
          </div>
        </div>
      </footer>
      <AIAssistant />
    </div>
  );
}