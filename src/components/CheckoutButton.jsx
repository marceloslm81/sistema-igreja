import { useState } from 'react';
import { Loader2, Heart } from 'lucide-react';
import { createCheckoutSession } from '@/lib/payment';
import { vibex } from '@/api/vibexClient';
export default function CheckoutButton({ amount, currency = 'brl', label = 'Doar agora', reference = 'Doação online', type = 'oferta' }) {
  const [loading, setLoading] = useState(false);
  const handleCheckout = async () => {
    if (!amount || amount <= 0) {
      alert('Informe um valor válido.');
      return;
    }
    setLoading(true);
    try {
      const cents = Math.round(amount * 100);
      const pending = await vibex.entities.Payment.create({
        userId: 'portal-membro',
        amount: cents,
        currency,
        status: 'pending',
        metadata: { reference, type },
      });
      const session = await createCheckoutSession(cents, currency, `${reference} - Church OS`);
      const sid = session?.session_id || session?.id;
      if (sid) {
        await vibex.entities.Payment.update(pending.data?.id || pending.id, { stripeSessionId: sid });
      }
      setLoading(false);
    } catch (err) {
      alert('Não foi possível iniciar o pagamento: ' + err.message);
      setLoading(false);
    }
  };
  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:bg-amber-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-95"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} />}
      {loading ? 'Processando...' : label}
    </button>
  );
}