import { useState, useRef, useEffect } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, isSameMonth, isSameDay, parseISO
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
export default function DatePicker({ value, onChange, placeholder = 'Selecione a data' }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(new Date());
  const ref = useRef(null);
  const selected = value ? (() => { try { return parseISO(value); } catch { return null; } })() : null;
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  useEffect(() => {
    if (selected) setView(selected);
  }, [value]);
  const buildDays = () => {
    const monthStart = startOfMonth(view);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 0 });
    const days = [];
    let d = gridStart;
    while (d <= gridEnd) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  };
  const pick = (day) => {
    const iso = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12, 0, 0).toISOString();
    onChange(iso);
    setOpen(false);
  };
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-left text-sm hover:border-[#4F46E5] focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-100 outline-none"
      >
        <span className={selected ? 'text-slate-900' : 'text-slate-400'}>
          {selected ? format(selected, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : placeholder}
        </span>
        <CalIcon className="w-4 h-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => setView(addMonths(view, -1))} className="p-1.5 rounded-lg hover:bg-slate-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-slate-800 capitalize">
              {format(view, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button type="button" onClick={() => setView(addMonths(view, 1))} className="p-1.5 rounded-lg hover:bg-slate-100">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((w, i) => (
              <div key={i} className="text-center text-xs text-slate-400 py-1">{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {buildDays().map((day, i) => {
              const isSel = selected && isSameDay(day, selected);
              const inMonth = isSameMonth(day, view);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(day)}
                  className={`text-center text-sm py-1.5 rounded-lg transition-colors ${
                    isSel ? 'bg-[#4F46E5] text-white font-semibold'
                    : inMonth ? 'text-slate-700 hover:bg-indigo-50' : 'text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}