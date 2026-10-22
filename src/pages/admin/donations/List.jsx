import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CreditCard, Loader2, TrendingUp } from 'lucide-react';
import { Donation } from '@/api/entities';
const typeLabel = { dizimo: 'Dízimo', oferta: 'Oferta', campanha: 'Campanha' };
const typeColor = { dizimo: 'bg-indigo-100 text-indigo-700', oferta: 'bg-amber-100 text-amber-700', campanha: 'bg-violet-100 text-violet-700' };
const methodLabel = { pix: 'PIX', cartao: 'Cartão', dinheiro: 'Dinheiro', transferencia: 'Transferência' };
export default function DonationsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setLoading(true);
    Donation.paging({ page: 1, limit: 100, sort: '-date' }).then((r) => {
      const items = r.data.data || [];
      setData(items);
      setTotal(items.reduce((s, d) => s + (Number(d.amount) || 0), 0));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const brl = (v) => 'R$ ' + Number(v || 0).toLocaleString('pt-BR');
  const fmt = (iso) => { try { return new Date(iso).toLocaleDateString('pt-BR'); } catch { return iso; } };
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Dízimos & Ofertas</h1>
          <p className="text-slate-500 text-sm mt-0.5">Registro de contribuições</p>
        </div>
        <Link to="/admin/donations/create" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA]">
          <Plus className="w-4 h-4" /> Registrar
        </Link>
      </div>
      <div className="bg-gradient-to-br from-[#4F46E5] to-[#4338CA] text-white rounded-2xl p-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center"><TrendingUp className="w-6 h-6" /></div>
        <div>
          <p className="text-indigo-200 text-sm">Total arrecadado (registros exibidos)</p>
          <p className="text-3xl font-bold font-display">{brl(total)}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="animate-pulse h-10 bg-slate-100 rounded" />)}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-16"><CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500">Nenhum registro</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-slate-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Membro</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Forma</th>
                  <th className="px-6 py-3 font-medium hidden lg:table-cell">Referência</th>
                  <th className="px-6 py-3 font-medium hidden sm:table-cell">Data</th>
                  <th className="px-6 py-3 font-medium text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50">
                    <td className="px-6 py-3 font-medium text-slate-800">{d.memberName || '—'}</td>
                    <td className="px-6 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeColor[d.type] || 'bg-slate-100'}`}>{typeLabel[d.type] || d.type}</span></td>
                    <td className="px-6 py-3 hidden md:table-cell text-slate-600">{methodLabel[d.paymentMethod] || d.paymentMethod}</td>
                    <td className="px-6 py-3 hidden lg:table-cell text-slate-500">{d.reference || '—'}</td>
                    <td className="px-6 py-3 hidden sm:table-cell text-slate-500">{fmt(d.date)}</td>
                    <td className="px-6 py-3 text-right font-semibold text-slate-900">{brl(d.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}