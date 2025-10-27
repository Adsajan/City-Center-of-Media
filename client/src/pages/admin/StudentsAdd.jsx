import React, { useEffect, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';
import DatePicker from '../../components/ui/DatePicker.jsx';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select.jsx';

export default function AdminStudentsAdd() {
  const [form, setForm] = useState({
    // User
    name: '', email: '', password: '', avatar: '',
    // Personal
    dob: '', gender: '', nationalId: '', phoneMobile: '', phoneWhatsapp: '', address: '',
    // Guardian
    guardianName: '', guardianRelationship: '', guardianPhone: '', guardianEmail: '', guardianOccupation: '', guardianAddress: '',
    // Academic
    admissionNumber: '', courseId: '', sectionOrBatch: '', rollNo: '', previousSchool: '', admissionDate: '', academicYear: '', term: ''
  });
  const [courses, setCourses] = useState([]);
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/courses');
        setCourses(data || []);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const create = async (e) => {
    e.preventDefault();
    setErr(''); setOk('');
    try {
      const payload = { ...form };
      const { data } = await api.post('/students/full', payload);
      setOk(`Created student: ${data?.user?.name || ''}`);
      setForm({ name: '', email: '', password: '', avatar: '', dob: '', gender: '', nationalId: '', phoneMobile: '', phoneWhatsapp: '', address: '', guardianName: '', guardianRelationship: '', guardianPhone: '', guardianEmail: '', guardianOccupation: '', guardianAddress: '', admissionNumber: '', courseId: '', sectionOrBatch: '', rollNo: '', previousSchool: '', admissionDate: '', academicYear: '', term: '' });
    } catch (e) {
      setErr(e?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold mb-3">Add Student</h2>
        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2 font-medium text-gray-700">1. Basic Personal Information</div>
          <input className="border rounded px-3 py-2 text-sm" placeholder="Full Name" value={form.name} onChange={update('name')} required />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Email Address" type="email" value={form.email} onChange={update('email')} required />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Password" type="password" value={form.password} onChange={update('password')} required />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Profile Photo URL" value={form.avatar} onChange={update('avatar')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="National ID / Passport" value={form.nationalId} onChange={update('nationalId')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Contact Number (Mobile)" value={form.phoneMobile} onChange={update('phoneMobile')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Contact Number (WhatsApp)" value={form.phoneWhatsapp} onChange={update('phoneWhatsapp')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Home Address" value={form.address} onChange={update('address')} />
          <label className="text-sm text-gray-600">Date of Birth
            <DatePicker value={form.dob} onChange={(v)=>setForm({...form,dob:v})} />
          </label>
          <label className="text-sm text-gray-600">Gender
            <select className="border rounded px-3 py-2 text-sm w-full" value={form.gender} onChange={update('gender')}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>

          <div className="md:col-span-2 font-medium text-gray-700 mt-2">2. Parent / Guardian Information</div>
          <input className="border rounded px-3 py-2 text-sm" placeholder="Parent/Guardian Full Name" value={form.guardianName} onChange={update('guardianName')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Relationship to Student" value={form.guardianRelationship} onChange={update('guardianRelationship')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Contact Number" value={form.guardianPhone} onChange={update('guardianPhone')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Email Address (optional)" type="email" value={form.guardianEmail} onChange={update('guardianEmail')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Occupation" value={form.guardianOccupation} onChange={update('guardianOccupation')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Address (if different)" value={form.guardianAddress} onChange={update('guardianAddress')} />

          <div className="md:col-span-2 font-medium text-gray-700 mt-2">3. Academic Information</div>
          <input className="border rounded px-3 py-2 text-sm" placeholder="Admission Number (leave blank to auto-generate)" value={form.admissionNumber} onChange={update('admissionNumber')} />
          <div className="text-sm text-gray-600">
            Course
            <div className="mt-1">
              <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {(c.courseCode ? `${c.courseCode} - ` : '') + (c.courseName || 'Untitled')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <input className="border rounded px-3 py-2 text-sm" placeholder="Section or Batch" value={form.sectionOrBatch} onChange={update('sectionOrBatch')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Roll Number" value={form.rollNo} onChange={update('rollNo')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Previous School / Institute" value={form.previousSchool} onChange={update('previousSchool')} />
          <label className="text-sm text-gray-600">Admission Date
            <DatePicker value={form.admissionDate} onChange={(v)=>setForm({...form,admissionDate:v})} />
          </label>
          <input className="border rounded px-3 py-2 text-sm" placeholder="Academic Year" value={form.academicYear} onChange={update('academicYear')} />
          <input className="border rounded px-3 py-2 text-sm" placeholder="Term" value={form.term} onChange={update('term')} />

          <div className="md:col-span-2"><button className="btn btn-primary" type="submit">Create</button></div>
        </form>
        {ok && <div className="text-green-600 text-sm mt-2">{ok}</div>}
        {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
      </Card>
    </div>
  );
}

