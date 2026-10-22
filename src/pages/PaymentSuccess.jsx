import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle size={44} className="text-green-600" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-display">Doação recebida!</h1>
      <p className="text-slate-500 max-w-md">Sua contribuição está sendo processada com segurança. Que Deus abençoe sua generosidade.</p>
      <Link to="/" className="mt-4 px-6 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors font-medium">
        Voltar ao início
      </Link>
    </div>
  );
}