import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { Auth } from '@/api/entities';
const validatePassword = (pw) => {
  if (pw.length < 8) return 'min_length';
  if (!/[0-9]/.test(pw)) return 'no_digit';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) return 'no_special';
  return null;
};
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const validateField = (field, value) => {
    let msg = '';
    if (field === 'name' && value.trim().length < 2) msg = 'Informe seu nome completo';
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'E-mail inválido';
    if (field === 'password') {
      const code = validatePassword(value);
      if (code) msg = 'A senha deve ter 8+ caracteres e incluir um número e um caractere especial';
    }
    if (field === 'passwordConfirm' && value !== form.password) msg = 'As senhas não coincidem';
    setErrors((e) => ({ ...e, [field]: msg }));
    return msg;
  };
  const isValid = () => {
    return form.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      !validatePassword(form.password) &&
      form.password === form.passwordConfirm;
  };
  const handleRegister = async () => {
    const nameErr = validateField('name', form.name);
    const emailErr = validateField('email', form.email);
    const pwErr = validateField('password', form.password);
    const confErr = validateField('passwordConfirm', form.passwordConfirm);
    if (nameErr || emailErr || pwErr || confErr) return;
    if (loading) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await Auth.register({ email: form.email, password: form.password, name: form.name });
      const { token, user } = res.data.data;
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/portal');
    } catch (e) {
      setApiError('Não foi possível criar a conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  const inputCls = (field) => `w-full px-4 py-3 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-100 outline-none ${errors[field] ? 'border-red-500 focus:border-red-500' : 'border-stone-300 focus:border-[#4F46E5]'}`;
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8" role="form" aria-label="Criar conta">
          <div className="text-center mb-6">
            <img src="https://cdn.vibe-x.app/apps/c51c12761c2c4713d48524f4/assets/original/logo-0-85875.png" alt="Church OS" className="h-9 w-auto object-contain mx-auto" />
            <h1 className="mt-5 text-2xl font-bold text-slate-900 font-display">Criar sua conta</h1>
            <p className="mt-1 text-sm text-slate-500">Junte-se à sua comunidade</p>
          </div>
          {apiError && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{apiError}</div>}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Nome completo</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onBlur={(e) => validateField('name', e.target.value)}
                  placeholder="Seu nome"
                  className={inputCls('name').replace('px-4', 'pl-10 pr-4')}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">E-mail</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onBlur={(e) => validateField('email', e.target.value)}
                  placeholder="seu@email.com"
                  className={inputCls('email').replace('px-4', 'pl-10 pr-4')}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Senha</label>
              <div className="mt-1 relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  onBlur={(e) => validateField('password', e.target.value)}
                  placeholder="8+ caracteres, com número e símbolo"
                  className={inputCls('password').replace('px-4', 'pl-4 pr-11')}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Confirmar senha</label>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
                onBlur={(e) => validateField('passwordConfirm', e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleRegister(); }}
                placeholder="Digite a senha novamente"
                className={`mt-1 ${inputCls('passwordConfirm')}`}
              />
              {errors.passwordConfirm && <p className="mt-1 text-sm text-red-600">{errors.passwordConfirm}</p>}
            </div>
            <button
              onClick={handleRegister}
              disabled={loading || !isValid()}
              className="w-full bg-[#4F46E5] text-white py-3 rounded-lg font-semibold hover:bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Criar conta
            </button>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem conta?{' '}
            <Link to="/login" className="text-[#4F46E5] font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}