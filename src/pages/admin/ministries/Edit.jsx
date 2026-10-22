import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Ministry } from '@/api/entities';
import MinistryForm from './MinistryForm';
export default function MinistryEdit() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Ministry.get(id).then((r) => setItem(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>;
  return <MinistryForm initial={item} ministryId={id} />;
}