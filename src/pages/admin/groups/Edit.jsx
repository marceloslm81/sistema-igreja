import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Group } from '@/api/entities';
import GroupForm from './GroupForm';
export default function GroupEdit() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Group.get(id).then((r) => setItem(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>;
  return <GroupForm initial={item} groupId={id} />;
}