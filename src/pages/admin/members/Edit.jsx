import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Member } from '@/api/entities';
import MemberForm from './MemberForm';
export default function MemberEdit() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Member.get(id).then((r) => setMember(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);
  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>;
  }
  return <MemberForm initial={member} memberId={id} />;
}