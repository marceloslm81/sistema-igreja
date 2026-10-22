import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Loader2, Mail, Phone, MapPin, Calendar, Users, Award } from 'lucide-react';
import { Member, Group } from '@/api/entities';
const statusColor = {
  ativo: 'bg-green-100 text-green-700',
  inativo: 'bg-amber-100 text-amber-700',
  transferido: 'bg-slate-100 text-slate-600',
  falecido: 'bg-slate-100 text-slate-600',
};
export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await Member.get(id);
        const m = r.data;
        setMember(m);
        if (m?.groupId) {
          try { const g = await Group.get(m.groupId); setGroup(g.data); } catch { /* noop */ }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);
  const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>;
  if (!member) return <div className="text-center py-20 text-slate-500">Membro não encontrado.</div>;
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <Link to="/admin/members" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#4F46E5]">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <Link to={`/admin/members/${id}/edit`} className="inline-flex items-center gap-2 bg-[#4F46E5] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4338CA]">
          <Edit className="w-4 h-4" /> Editar
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <div className="flex items-center gap-4">
          <img src={member.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + id} alt="" className="w-20 h-20 rounded-2xl bg-slate-100 object-cover" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">{member.name}</h1>
            <p className="text-sm text-slate-500 capitalize">{member.memberType}</p>
            <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusColor[member.status] || 'bg-slate-100 text-slate-600'}`}>{member.status}</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Info icon={Mail} label="E-mail" value={member.email || '—'} />
          <Info icon={Phone} label="Telefone" value={member.phone || '—'} />
          <Info icon={MapPin} label="Endereço" value={member.address || '—'} />
          <Info icon={MapPin} label="Cidade" value={member.city || '—'} />
          <Info icon={Calendar} label="Nascimento" value={fmt(member.birthDate)} />
          <Info icon={Calendar} label="Ingresso" value={fmt(member.joinDate)} />
          <Info icon={Calendar} label="Batismo" value={fmt(member.baptismDate)} />
          <Info icon={Users} label="Célula" value={group?.name || '—'} />
        </div>
        {member.ministryNames?.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2"><Award className="w-4 h-4 text-[#D97706]" /> Ministérios</p>
            <div className="flex flex-wrap gap-2">
              {member.ministryNames.map((m) => <span key={m} className="text-xs px-3 py-1 rounded-full bg-amber-50 text-[#D97706] font-medium">{m}</span>)}
            </div>
          </div>
        )}
        {member.pastoralNotes && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <p className="text-xs font-semibold text-[#4F46E5] mb-1">Notas pastorais (confidencial)</p>
            <p className="text-sm text-slate-700">{member.pastoralNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
    </div>
  );
}