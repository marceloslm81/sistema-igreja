import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart, Users, Heart, Calendar, Award, CreditCard, MessageCircle,
  Building, Settings, LogOut, Menu, X, Search, Bell
} from 'lucide-react';
import { Auth } from '@/api/entities';
import AIAssistant from '@/components/AIAssistant';
const NAV = [
  { to: '/admin', label: 'Dashboard', icon: BarChart, exact: true },
  { to: '/admin/members', label: 'Membros', icon: Users },
  { to: '/admin/groups', label: 'Células', icon: Building },
  { to: '/admin/ministries', label: 'Ministérios', icon: Award },
  { to: '/admin/events', label: 'Eventos', icon: Calendar },
  { to: '/admin/prayers', label: 'Oração', icon: Heart },
  { to: '/admin/donations', label: 'Dízimos', icon: CreditCard },
  { to: '/admin/campaigns', label: 'Campanhas', icon: BarChart },
  { to: '/admin/communications', label: 'Comunicação', icon: MessageCircle },
  { to: '/admin/settings', label: 'Configurações', icon: Settings },
];
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [navigate]);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    try { Auth.logout(); } catch { /* noop */ }
    navigate('/admin/login', { replace: true });
  };
  if (loading || !isAuthenticated) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#4F46E5] rounded-full animate-spin" />
      </div>
    );
  }
  const isActive = (item) => item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
  const SidebarContent = () => (
    <>
      <div className={`h-16 flex items-center ${collapsed ? 'justify-center' : 'px-6'} border-b border-indigo-900/40`}>
        <img src="https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/logo-0-85875.png" alt="Church OS" className="h-8 w-auto object-contain" style={{ filter: 'brightness(100) invert(30%)' }} />
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(item) ? 'bg-[#4F46E5] text-white' : 'text-indigo-200/80 hover:bg-indigo-900/40 hover:text-white'
            } ${collapsed ? 'justify-center' : ''}`}
            title={item.label}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-indigo-900/40">
        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-200/80 hover:bg-indigo-900/40 hover:text-white ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </>
  );
  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[#1E1B4B] transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent />
      </aside>
      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-[#1E1B4B] flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center px-4 md:px-6 gap-3">
          <button className="hidden lg:block p-2 rounded-lg hover:bg-slate-100 text-slate-600" onClick={() => setCollapsed((c) => !c)}>
            <Menu className="w-5 h-5" />
          </button>
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Busca global..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-sm focus:border-[#4F46E5] focus:bg-white outline-none" />
          </div>
          <div className="flex-1 sm:hidden" />
          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#D97706] rounded-full" />
          </button>
          <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
            <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'} alt="" className="w-8 h-8 rounded-full bg-slate-100" />
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'Administrador'}</p>
              <p className="text-xs text-slate-400 leading-tight capitalize">{user?.role || 'admin'}</p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}