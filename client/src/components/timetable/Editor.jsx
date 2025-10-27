import React, { useEffect, useMemo, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../ui/Card.jsx';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select.jsx';

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function TimeInput({ value, onChange, className='' }) {
  return (
    <input type="time" className={`border rounded px-3 py-2 text-sm ${className}`} value={value||''} onChange={(e)=>onChange(e.target.value)} />
  );
}

export default function TimetableEditor({ mode='admin' }) {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherId, setTeacherId] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ courseId:'', day:'', title:'', startTime:'', endTime:'', location:'' });

  useEffect(() => { (async () => {
    try {
      const cs = await api.get('/courses');
      setCourses(cs.data || []);
    } catch {}
    try {
      if (mode === 'admin') {
        const ts = await api.get('/teachers'); setTeachers(ts.data || []);
      } else {
        const me = await api.get('/teachers/me'); setTeacherId(me.data?._id || '');
      }
    } catch {}
  })(); }, [mode]);

  const load = async () => {
    const params = {};
    if (filterCourse) params.courseId = filterCourse;
    if (mode === 'teacher' && teacherId) params.teacherId = teacherId;
    const { data } = await api.get('/timetable', { params });
    setItems(data || []);
  };

  useEffect(() => { load(); }, [filterCourse, teacherId]);

  const create = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (mode === 'teacher') delete payload.teacherId; // set server-side
    if (!payload.courseId) payload.courseId = filterCourse;
    payload.day = Number(payload.day);
    const { data } = await api.post('/timetable', payload);
    setItems(prev => [...prev, data].sort((a,b)=> (a.day-b.day)||a.startTime.localeCompare(b.startTime)));
    setForm({ courseId:'', day:'', title:'', startTime:'', endTime:'', location:'' });
  };

  const del = async (id) => {
    if (!confirm('Delete this slot?')) return;
    await api.delete(`/timetable/${id}`);
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const dayName = (i) => days[i] || '';
  const notify = async (it) => {
    const defaultMsg = `Reminder: ${it.title || it.courseId?.courseName} on ${dayName(it.day)} ${it.startTime}-${it.endTime} at ${it.location || 'classroom'}.`;
    const msg = prompt('Message to send to all students in this course:', defaultMsg);
    if (msg === null) return;
    const includeSms = confirm('Also send as SMS? (OK = yes, Cancel = email only)');
    const body = { message: msg, channels: includeSms ? ['email','sms'] : ['email'] };
    const { data } = await api.post(`/timetable/${it._id}/notify`, body);
    alert(`Sent to ${data.recipients} students. Email: ${data.emailSent}${includeSms ? `, SMS: ${data.smsSent}` : ''}`);
  };

  const grouped = useMemo(() => {
    const g = {}; for (const it of items) { (g[it.day] ||= []).push(it); }
    Object.values(g).forEach(list => list.sort((a,b)=>a.startTime.localeCompare(b.startTime)));
    return g;
  }, [items]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Timetable</h2>
        <div className="flex gap-2">
          <Select value={filterCourse} onValueChange={setFilterCourse}>
            <SelectTrigger className="min-w-[220px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map(c => (
                <SelectItem key={c._id} value={c._id}>{(c.courseCode?`${c.courseCode} - `:'') + (c.courseName || 'Untitled')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-4">
        {mode==='admin' && (
          <Select value={form.teacherId||''} onValueChange={(v)=>setForm({...form, teacherId:v})}>
            <SelectTrigger className="md:col-span-2"><SelectValue placeholder="Select teacher" /></SelectTrigger>
            <SelectContent>
              {teachers.map(t => (
                <SelectItem key={t._id} value={t._id}>{t.user?.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select value={form.courseId} onValueChange={(v)=>setForm({...form, courseId:v})}>
          <SelectTrigger className="md:col-span-2"><SelectValue placeholder="Select course" /></SelectTrigger>
          <SelectContent>
            {courses.map(c => (
              <SelectItem key={c._id} value={c._id}>{(c.courseCode?`${c.courseCode} - `:'') + (c.courseName || 'Untitled')}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(form.day)} onValueChange={(v)=>setForm({...form, day:v})}>
          <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
          <SelectContent>
            {days.map((d, i)=>(<SelectItem key={i} value={String(i)}>{d}</SelectItem>))}
          </SelectContent>
        </Select>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Title (e.g. Lecture)" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
        <TimeInput value={form.startTime} onChange={(v)=>setForm({...form,startTime:v})} />
        <TimeInput value={form.endTime} onChange={(v)=>setForm({...form,endTime:v})} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Location" value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} />
        <div className="md:col-span-2"><button className="btn btn-primary" type="submit">Add</button></div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({length:7}).map((_,i)=> (
          <div key={i} className="border rounded p-3">
            <div className="font-medium text-sm mb-2">{days[i]}</div>
            <div className="space-y-2">
              {(grouped[i]||[]).map(it => (
                <div key={it._id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded px-3 py-2">
                  <div>
                    <div className="font-medium text-sm">{it.title || it.courseId?.courseName}</div>
                    <div className="text-xs text-gray-600">{it.startTime} - {it.endTime} • {it.location || '—'}</div>
                    <div className="text-xs text-gray-600">{it.courseId?.courseCode ? `${it.courseId.courseCode} – ` : ''}{it.courseId?.courseName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-outline" onClick={()=>notify(it)}>Notify</button>
                    <button className="btn btn-outline" onClick={()=>del(it._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
