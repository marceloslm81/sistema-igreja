import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Event } from '@/api/entities';
import EventForm from './EventForm';
export default function EventEdit() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Event.get(id).then((r) => setItem(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>;
  return <EventForm initial={item} eventId={id} />;
}