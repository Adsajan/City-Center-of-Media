import React, { useEffect, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';

export default function AdminExams() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', term: '' });
  useEffect(() => { (async () => {
    const { data } = await api.get('/exams');
    setItems(data);
  })(); }, []);

  const create = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/exams', form);
    setItems(prev => [data, ...prev]);
    setForm({ name: '', term: '' });
  };
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Exams</h2>
      </div>
      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Exam name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Term" value={form.term} onChange={(e)=>setForm({...form,term:e.target.value})} />
        <button className="btn btn-primary" type="submit">Create exam</button>
      </form>
      <ul className="list-disc pl-6">
        {items.map(x => <li key={x._id}>{x.name} – {x.term}</li>)}
      </ul>
    </Card>
  );
}
