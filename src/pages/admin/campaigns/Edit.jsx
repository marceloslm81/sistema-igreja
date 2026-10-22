import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Campaign } from '@/api/entities';
import CampaignForm from './CampaignForm';
export default function CampaignEdit() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Campaign.get(id).then((r) => setItem(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#4F46E5]" /></div>;
  return <CampaignForm initial={item} campaignId={id} />;
}