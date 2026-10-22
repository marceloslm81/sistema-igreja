import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Users, Edit, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Member } from '@/api/entities';
const statusColor = {
  ativo: 'bg-green-100 text-green-700',
  inativo: 'bg-amber-100 text-amber-700',
  transferido: 'bg-slate-100 text-slate-600',
  falecido: 'bg-slate-100 text-slate-600',
};
export default function MembersList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const isComposingRef = useRef(false);
  const fetchData = async (pageNum) => {
    setLoading(true);
    try {
      const filter = { search };
      if (statusFilter) filter.status = statusFilter;
      const res = await Member.paging({ page: pageNum, limit: 10, filter, sort: '-created_at' });
      setData(res.data.data || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNum);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isComposingRef.current) return;
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);
  useEffect(() => {
    fetchData(1);
  }, [search, statusFilter]);
  const getPageNumbers = () => {
    const pages = [];
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);
    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Membros</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} pessoas cadastradas</p>
        </div>
        <Link to="/admin/members/create" className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4338CA] transition-colors">
          <Plus className="w-4 h-4" /> Novo membro
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onCompositionStart={() => { isComposingRef.current = true; }}
            onCompositionEnd={(e) => { isComposingRef.current = false; setSearchInput(e.currentTarget.value); }}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && !isComposingRef.current) setSearch(searchInput); }}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:border-[#4F46E5] outline-none"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-lg border border-stone-300 text-sm bg-white outline-none focus:border-[#4F46E5]">
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="transferido">Transferido</option>
          <option value="falecido">Falecido</option>
        </select>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse h-12 bg-slate-100 rounded-lg" />)}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Nenhum membro encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-slate-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Membro</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Contato</th>
                  <th className="px-6 py-3 font-medium hidden lg:table-cell">Tipo</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img src={m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + m.id} alt="" className="w-9 h-9 rounded-full bg-slate-100" />
                        <div>
                          <p className="font-medium text-slate-800">{m.name}</p>
                          <p className="text-xs text-slate-400 md:hidden">{m.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-slate-600">
                      <p>{m.email}</p>
                      <p className="text-xs text-slate-400">{m.phone}</p>
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell capitalize text-slate-600">{m.memberType}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColor[m.status] || 'bg-slate-100 text-slate-600'}`}>{m.status}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/members/${m.id}`} className="p-2 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-[#4F46E5]"><Eye className="w-4 h-4" /></Link>
                        <Link to={`/admin/members/${m.id}/edit`} className="p-2 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-[#4F46E5]"><Edit className="w-4 h-4" /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => fetchData(page - 1)} disabled={page <= 1 || loading} className="p-2 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
          {getPageNumbers().map((p, i) => p === '...' ? <span key={i} className="px-2 text-slate-400">...</span> : (
            <button key={i} onClick={() => fetchData(p)} disabled={loading} className={`w-9 h-9 rounded-lg text-sm font-medium ${p === page ? 'bg-[#4F46E5] text-white' : 'border border-stone-200 hover:bg-slate-50'}`}>{p}</button>
          ))}
          <button onClick={() => fetchData(page + 1)} disabled={page >= totalPages || loading} className="p-2 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}