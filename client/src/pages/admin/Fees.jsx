import React, { useEffect, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';
import { currency, dateFmt } from '../../lib/formatters.js';

export default function AdminFees() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', amount: '', dueDate: '' });

  useEffect(() => { (async () => {
    const fees = await api.get('/fees');
    setItems(fees.data);
    const studs = await api.get('/students');
    setStudents(studs.data);
  })(); }, []);

  const create = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    const { data } = await api.post('/fees', payload);
    setItems(prev => [data, ...prev]);
    setForm({ studentId: '', amount: '', dueDate: '' });
  };
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Fees</h2>
      </div>

      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
        <select className="border rounded px-3 py-2 text-sm" value={form.studentId} onChange={(e)=>setForm({...form,studentId:e.target.value})} required>
          <option value="">Select student</option>
          {students.map(s => <option key={s._id} value={s._id}>{s.user?.name}</option>)}
        </select>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Amount" type="number" value={form.amount} onChange={(e)=>setForm({...form,amount:e.target.value})} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Due date" type="date" value={form.dueDate} onChange={(e)=>setForm({...form,dueDate:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-1" placeholder="Description" value={form.description||''} onChange={(e)=>setForm({...form,description:e.target.value})} />
        <button className="btn btn-primary" type="submit">Add invoice</button>
      </form>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Student</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i._id} className="border-b">
              <td className="py-2">{i.studentId?.user?.name}</td>
              <td>{currency(i.amount)}</td>
              <td>{i.status}</td>
              <td>{dateFmt(i.dueDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
