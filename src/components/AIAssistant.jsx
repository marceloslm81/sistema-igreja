import { useState, useRef, useEffect } from 'react';
import { Zap, X, Send, Loader2, Sparkles } from 'lucide-react';
import { aiflow1020, aiflow1020ConfigPromise } from '@/lib/aiflow';
const QUICK_ACTIONS = [
  { label: 'Rascunhar comunicado', prompt: 'Escreva um rascunho de comunicado para os membros convidando para o culto de celebração deste domingo.' },
  { label: 'Resumir ata', prompt: 'Resuma em tópicos os principais pontos e decisões de uma ata de reunião de liderança.' },
  { label: 'Sugerir acompanhamento', prompt: 'Sugira quais membros merecem acompanhamento pastoral considerando inatividade e ausência em grupos.' },
  { label: 'Checklist de evento', prompt: 'Gere um checklist de organização para um evento de conferência de jovens.' },
];
export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou o assistente do Church OS. Posso rascunhar comunicados, resumir atas, sugerir acompanhamento pastoral e explicar indicadores. Como posso ajudar?' },
  ]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);
  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    setInput('');
    const next = [...messages, { role: 'user', content }];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setSending(true);
    try {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const config = await aiflow1020ConfigPromise;
      const systemPrompt = config?.systemPrompt || '';
      const stream = aiflow1020.chatStream({
        system: systemPrompt,
        messages: next.map((m) => ({ role: m.role, content: m.content })),
        signal: ctrl.signal,
      });
      let acc = '';
      for await (const chunk of stream) {
        if (chunk.delta) {
          acc += chunk.delta;
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'assistant', content: acc };
            return copy;
          });
        }
        if (chunk.done) break;
      }
      if (!acc) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: 'Não recebi resposta. Tente novamente.' };
          return copy;
        });
      }
    } catch (err) {
      const msg = err?.status === 402
        ? 'Os créditos de IA foram esgotados. Contate o administrador da plataforma.'
        : `Ocorreu um erro: ${err.message}`;
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'assistant', content: `⚠️ ${msg}` };
        return copy;
      });
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir assistente de IA"
          className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#D97706] text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center sm:justify-end sm:p-6 bg-black/30 sm:bg-transparent" onClick={() => setOpen(false)}>
          <div
            className="w-full sm:w-[400px] h-[80vh] sm:h-[600px] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">Assistente AIFlow</p>
                  <p className="text-[11px] text-white/70 leading-tight">Apoio à liderança</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/15">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#4F46E5] text-white rounded-br-md'
                      : 'bg-white border border-stone-200 text-slate-700 rounded-bl-md'
                  }`}>
                    {m.content || (sending && i === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : '')}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-3 pt-2 flex gap-2 overflow-x-auto border-t border-stone-100 bg-white [&::-webkit-scrollbar]:hidden">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => send(a.prompt)}
                  disabled={sending}
                  className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-[#4F46E5] font-medium hover:bg-indigo-100 disabled:opacity-50 whitespace-nowrap"
                >
                  {a.label}
                </button>
              ))}
            </div>
            <div className="p-3 bg-white border-t border-stone-100 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) send();
                }}
                placeholder="Escreva sua mensagem..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none"
              />
              <button
                onClick={() => send()}
                disabled={sending || !input.trim()}
                className="w-10 h-10 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center hover:bg-[#4338CA] disabled:opacity-50 active:scale-95 transition-transform"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}