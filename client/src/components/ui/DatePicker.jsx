import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

function pad(n) { return String(n).padStart(2, '0'); }
function fmtYMD(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function parseYMD(s) {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

export default function DatePicker({ value, onChange, className = '', inputClassName = '', placeholder = 'YYYY-MM-DD', ...props }) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(() => parseYMD(value), [value]);
  const [month, setMonth] = useState(() => selected || new Date());
  const wrapRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => { if (selected) setMonth(selected); }, [selected?.getFullYear(), selected?.getMonth()]);

  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const startWeekday = firstOfMonth.getDay(); // 0-6 (Sun-Sat)
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1 - startWeekday);
  const days = Array.from({ length: 42 }, (_, i) => new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i));

  const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const apply = (d) => {
    onChange && onChange(fmtYMD(d));
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className={['relative', className].join(' ')}>
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" onClick={() => setOpen((v) => !v)} />
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        className={['border rounded pl-9 pr-10 py-2 text-sm w-full', inputClassName].join(' ')}
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        {...props}
      />
      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-md border bg-white dark:bg-gray-900 shadow-md p-3">
          <div className="flex items-center justify-between mb-2">
            <button type="button" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium">{month.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
            <button type="button" className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-1">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (<div key={d} className="text-center py-1">{d}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {days.map((d, idx) => {
              const inMonth = d.getMonth() === month.getMonth();
              const isSel = selected && isSameDay(d, selected);
              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    'h-8 w-8 rounded text-center mx-auto',
                    inMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400',
                    isSel ? 'bg-sky-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  ].join(' ')}
                  onClick={() => apply(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
