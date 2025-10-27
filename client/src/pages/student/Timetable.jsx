import React, { useEffect, useMemo, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function StudentTimetable() {
  const [items, setItems] = useState([]);
  useEffect(() => { (async () => {
    try { const { data } = await api.get('/timetable/student'); setItems(data||[]); } catch {}
  })(); }, []);

  const grouped = useMemo(() => {
    const g = {}; for (const it of items) { (g[it.day] ||= []).push(it); }
    Object.values(g).forEach(list => list.sort((a,b)=>a.startTime.localeCompare(b.startTime)));
    return g;
  }, [items]);

  return (
    <Card>
      <div className="text-xl font-semibold mb-3">My Timetable</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({length:7}).map((_,i)=> (
          <div key={i} className="border rounded p-3">
            <div className="font-medium text-sm mb-2">{days[i]}</div>
            <div className="space-y-2">
              {(grouped[i]||[]).map(it => (
                <div key={it._id} className="bg-gray-50 dark:bg-gray-800 rounded px-3 py-2">
                  <div className="font-medium text-sm">{it.title || it.courseId?.courseName}</div>
                  <div className="text-xs text-gray-600">{it.startTime} - {it.endTime} • {it.location || '—'}</div>
                  <div className="text-xs text-gray-600">{it.teacherId?.user?.name || ''}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
