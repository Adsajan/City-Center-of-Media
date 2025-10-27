import React from 'react';

export default function KpiCard({ title, value, hint, icon }) {
  return (
    <div className="kpi">
      <div className="flex items-center justify-between">
        <div className="text-sm muted">{title}</div>
        {icon || null}
      </div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="muted mt-1">{hint}</div>}
    </div>
  );
}

