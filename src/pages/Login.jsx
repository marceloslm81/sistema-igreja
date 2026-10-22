import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { Auth } from '@/api/entities';
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleLogin = async () => {
    if (!email || !password || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await Auth.login({ email, password });
      const { token, user } = res.data.data;
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/portal');
    } catch (e) {
      setError('E-mail ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8" role="form" aria-label="Login do membro">
          <div className="text-center mb-6">
            <img src="https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/logo-0-85875.png" alt="Church OS" className="h-9 w-auto object-contain mx-auto" />
            <h1 className="mt-5 text-2xl font-bold text-slate-900 font-display">Bem-vindo de volta</h1>
            <p className="mt-1 text-sm text-slate-500">Acesse o Portal do Membro</p>
          </div>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">E-mail</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleLogin(); }}
                  placeholder="Digite seu endereço de e-mail"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Senha</label>
              <div className="mt-1 relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleLogin(); }}
                  placeholder="Digite sua senha"
                  className="w-full pl-4 pr-11 py-3 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#4F46E5] text-white py-3 rounded-lg font-semibold hover:bg-[#4338CA] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              Entrar
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Ainda não tem conta?{' '}
            <Link to="/register" className="text-[#4F46E5] font-semibold hover:underline">Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}