import React, { useEffect, useState } from 'react';
import api from '../../lib/axios.js';
import Card from '../../components/ui/Card.jsx';
import DatePicker from '../../components/ui/DatePicker.jsx';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select.jsx';

export default function AdminTeachersAdd() {
  const [form, setForm] = useState({
    // Basic
    teacherId: '', fullName: '', gender: '', dob: '', nationalId: '', photo: '',
    // Contact
    email: '', phoneMobile: '', phoneWhatsapp: '', address: '', emergencyContact: '',
    // Auth
    password: '',
    // Academic & Professional
    qualification: '', specialization: '', experienceYears: '', certifications: '', languageProficiency: '',
    // Employment
    employeeType: '', joinDate: '', position: '', department: '', academicYear: '',
    // Teaching
    subjects: '', courseId: '',
    // Payroll
    salary: '', bankName: '', accountNumber: '', paymentStatus: '',
  });
  const [ok, setOk] = useState('');
  const [err, setErr] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => { (async () => {
    try { const { data } = await api.get('/courses'); setCourses(data || []); } catch {}
  })(); }, []);

  const create = async (e) => {
    e.preventDefault(); setOk(''); setErr('');
    try {
      const payload = { ...form };
      // Map UI fields to API expectations
      payload.name = form.fullName; // user.name
      // Parse arrays and numbers
      payload.subjects = form.subjects ? form.subjects.split(',').map(s=>s.trim()).filter(Boolean) : [];
      payload.certifications = form.certifications ? form.certifications.split(',').map(s=>s.trim()).filter(Boolean) : [];
      payload.languageProficiency = form.languageProficiency ? form.languageProficiency.split(',').map(s=>s.trim()).filter(Boolean) : [];
      payload.experienceYears = form.experienceYears ? Number(form.experienceYears) : undefined;
      // Create
      const { data } = await api.post('/teachers/full', payload);
      setOk(`Created teacher: ${data?.user?.name || data?.fullName || ''}`);
      setForm({ teacherId: '', fullName: '', gender: '', dob: '', nationalId: '', photo: '', email: '', phoneMobile: '', phoneWhatsapp: '', address: '', emergencyContact: '', password: '', qualification: '', specialization: '', experienceYears: '', certifications: '', languageProficiency: '', employeeType: '', joinDate: '', position: '', department: '', academicYear: '', subjects: '', courseId: '', salary: '', bankName: '', accountNumber: '', paymentStatus: '' });
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-3">Add Teacher</h2>
      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2 font-medium text-gray-700">1. Basic Information</div>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Teacher ID (e.g. TCH001)" value={form.teacherId} onChange={(e)=>setForm({...form,teacherId:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Full Name" value={form.fullName} onChange={(e)=>setForm({...form,fullName:e.target.value})} required />
        <label className="text-sm text-gray-600">Gender
          <select className="border rounded px-3 py-2 text-sm w-full" value={form.gender} onChange={(e)=>setForm({...form,gender:e.target.value})}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">Date of Birth
          <DatePicker value={form.dob} onChange={(v)=>setForm({...form,dob:v})} />
        </label>
        <input className="border rounded px-3 py-2 text-sm" placeholder="National ID" value={form.nationalId} onChange={(e)=>setForm({...form,nationalId:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Photo URL (optional)" value={form.photo} onChange={(e)=>setForm({...form,photo:e.target.value})} />

        <div className="md:col-span-2 font-medium text-gray-700 mt-2">2. Contact & Access</div>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Mobile" value={form.phoneMobile} onChange={(e)=>setForm({...form,phoneMobile:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="WhatsApp" value={form.phoneWhatsapp} onChange={(e)=>setForm({...form,phoneWhatsapp:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Address" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Emergency Contact (name & phone)" value={form.emergencyContact} onChange={(e)=>setForm({...form,emergencyContact:e.target.value})} />

        <div className="md:col-span-2 font-medium text-gray-700 mt-2">3. Academic & Professional</div>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Qualification (e.g. B.Sc, M.Ed)" value={form.qualification} onChange={(e)=>setForm({...form,qualification:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Specialization (e.g. Physics)" value={form.specialization} onChange={(e)=>setForm({...form,specialization:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Experience Years" value={form.experienceYears} onChange={(e)=>setForm({...form,experienceYears:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Certifications (comma separated)" value={form.certifications} onChange={(e)=>setForm({...form,certifications:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Languages (comma separated)" value={form.languageProficiency} onChange={(e)=>setForm({...form,languageProficiency:e.target.value})} />

        <div className="md:col-span-2 font-medium text-gray-700 mt-2">4. Employment</div>
        <label className="text-sm text-gray-600">Employee Type
          <select className="border rounded px-3 py-2 text-sm w-full" value={form.employeeType} onChange={(e)=>setForm({...form,employeeType:e.target.value})}>
            <option value="">Select</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Visiting</option>
          </select>
        </label>
        <label className="text-sm text-gray-600">Join Date
          <DatePicker value={form.joinDate} onChange={(v)=>setForm({...form,joinDate:v})} />
        </label>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Position (e.g. Lecturer)" value={form.position} onChange={(e)=>setForm({...form,position:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Department" value={form.department} onChange={(e)=>setForm({...form,department:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Academic Year (e.g. 2024-2025)" value={form.academicYear} onChange={(e)=>setForm({...form,academicYear:e.target.value})} />

        <div className="md:col-span-2 font-medium text-gray-700 mt-2">5. Teaching</div>
        <input className="border rounded px-3 py-2 text-sm md:col-span-2" placeholder="Subjects (comma separated)" value={form.subjects} onChange={(e)=>setForm({...form,subjects:e.target.value})} />
        <div className="text-sm text-gray-600 md:col-span-2">
          Assign Course (optional)
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

        <div className="md:col-span-2 font-medium text-gray-700 mt-2">6. Salary & Payroll (optional)</div>
        <input className="border rounded px-3 py-2 text-sm" placeholder="Salary" value={form.salary} onChange={(e)=>setForm({...form,salary:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Bank Name" value={form.bankName} onChange={(e)=>setForm({...form,bankName:e.target.value})} />
        <input className="border rounded px-3 py-2 text-sm" placeholder="Account Number" value={form.accountNumber} onChange={(e)=>setForm({...form,accountNumber:e.target.value})} />
        <label className="text-sm text-gray-600">Payment Status
          <select className="border rounded px-3 py-2 text-sm w-full" value={form.paymentStatus} onChange={(e)=>setForm({...form,paymentStatus:e.target.value})}>
            <option value="">Select</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Retired</option>
          </select>
        </label>
        <div className="md:col-span-2"><button className="btn btn-primary" type="submit">Create</button></div>
      </form>
      {ok && <div className="text-green-600 text-sm mt-2">{ok}</div>}
      {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
    </Card>
  );
}
