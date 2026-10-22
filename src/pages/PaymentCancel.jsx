import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
        <AlertCircle size={44} className="text-[#D97706]" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">Pagamento cancelado</h1>
      <p className="text-slate-500 max-w-md">O processo foi interrompido. Você pode tentar novamente quando quiser.</p>
      <Link to="/portal" className="mt-4 px-6 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors font-medium">
        Voltar ao portal
      </Link>
    </div>
  );
}