import React, { useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import api from '../../../lib/axios.js';

export default function AdminClassesAdd() {
  const [form, setForm] = useState({ name: '', section: '', subjects: '' });
  const [ok, setOk] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, subjects: form.subjects ? form.subjects.split(',').map(s=>s.trim()).filter(Boolean) : [] };
    await api.post('/classes', payload);
    setOk('Class created');
    setForm({ name: '', section: '', subjects: '' });
  };
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-2">Add Class</h2>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Class name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Section" value={form.section} onChange={(e)=>setForm({...form,section:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Subjects (comma separated)" value={form.subjects} onChange={(e)=>setForm({...form,subjects:e.target.value})} />
        <button className="btn btn-primary" type="submit">Create</button>
      </form>
      {ok && <div className="text-green-600 text-sm mt-2">{ok}</div>}
    </Card>
  );
}

