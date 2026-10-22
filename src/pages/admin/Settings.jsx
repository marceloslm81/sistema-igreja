import { useState, useEffect } from 'react';
import { Save, Palette, Building, Type, CheckCircle, Shield, Lock } from 'lucide-react';
const PRESET_COLORS = ['#4F46E5', '#0EA5E9', '#059669', '#DC2626', '#D97706', '#7C3AED', '#DB2777'];
export default function Settings() {
  const [settings, setSettings] = useState({
    churchName: 'Church OS',
    primaryColor: '#4F46E5',
    terminology: 'celula',
    cellLabel: 'Célula',
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('church_settings'));
      if (s) setSettings((prev) => ({ ...prev, ...s }));
    } catch { /* noop */ }
  }, []);
  const set = (k, v) => setSettings((s) => ({ ...s, [k]: v }));
  const handleSave = () => {
    localStorage.setItem('church_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const cls = 'w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none';
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Configurações</h1>
        <p className="text-slate-500 text-sm mt-0.5">Personalização por igreja (tenant)</p>
      </div>
      {saved && <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Configurações salvas!</div>}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2 text-slate-800 font-semibold"><Building className="w-5 h-5 text-[#4F46E5]" /> Identidade</div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Nome da igreja</label><input value={settings.churchName} onChange={(e) => set('churchName', e.target.value)} className={cls} /></div>
        <div className="flex items-center gap-2 text-slate-800 font-semibold pt-2"><Palette className="w-5 h-5 text-[#D97706]" /> Cor primária</div>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((c) => (
            <button key={c} onClick={() => set('primaryColor', c)} className={`w-10 h-10 rounded-xl transition-transform ${settings.primaryColor === c ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }} aria-label={c} />
          ))}
        </div>
        <div className="flex items-center gap-2 text-slate-800 font-semibold pt-2"><Type className="w-5 h-5 text-violet-600" /> Terminologia</div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Como chamar os pequenos grupos</label>
          <select value={settings.cellLabel} onChange={(e) => set('cellLabel', e.target.value)} className={cls + ' bg-white'}>
            <option>Célula</option>
            <option>Pequeno Grupo</option>
            <option>Grupo Familiar</option>
            <option>Grupo de Comunhão</option>
          </select>
        </div>
        <button onClick={handleSave} className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA]">
          <Save className="w-4 h-4" /> Salvar configurações
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-4"><Shield className="w-5 h-5 text-emerald-600" /> Segurança & Conformidade</div>
        <div className="space-y-3">
          {[
            { label: 'Autenticação em dois fatores (2FA)', on: true },
            { label: 'Criptografia de dados sensíveis', on: true },
            { label: 'Conformidade com LGPD', on: true },
            { label: 'Backups automáticos diários', on: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
              <span className="text-sm text-slate-700 flex items-center gap-2"><Lock className="w-4 h-4 text-slate-400" /> {item.label}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">Ativo</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">Estas opções representam a configuração de segurança da plataforma.</p>
      </div>
    </div>
  );
}