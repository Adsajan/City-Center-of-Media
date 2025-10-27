import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import logo from '../assets/ccm-logo.svg';
import RoleGuard from './guards/RoleGuard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import DemoToolbar from '../components/DemoToolbar.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminStudents from '../pages/admin/students/List.jsx';
import AdminStudentsAdd from '../pages/admin/students/Add.jsx';
import AdminTeachers from '../pages/admin/teachers/List.jsx';
import AdminTeachersAdd from '../pages/admin/teachers/Add.jsx';
import AdminCoursesList from '../pages/admin/courses/List.jsx';
import AdminCoursesAdd from '../pages/admin/courses/Add.jsx';
import AdminFees from '../pages/admin/Fees.jsx';
import AdminExams from '../pages/admin/Exams.jsx';
import AdminTimetable from '../pages/admin/timetable/Index.jsx';
import AdminAttendanceStudents from '../pages/admin/attendance/Students.jsx';
import AdminAttendanceTeachers from '../pages/admin/attendance/Teachers.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import TeacherDashboard from '../pages/teacher/dashboard/Index.jsx';
import TeacherAttendance from '../pages/teacher/attendance/Index.jsx';
import TeacherTimetable from '../pages/teacher/timetable/Index.jsx';
import TeacherProfile from '../pages/teacher/Profile.jsx';
import TeacherMarks from '../pages/teacher/marks/Index.jsx';
import StudentDashboard from '../pages/student/dashboard/Index.jsx';
import StudentTimetable from '../pages/student/timetable/Index.jsx';
import StudentProfile from '../pages/student/Profile.jsx';
import StudentResults from '../pages/student/results/Index.jsx';
import StudentFees from '../pages/student/fees/Index.jsx';

function Layout({ children }) {
  const { demo, enableDemo, disableDemo } = useAuth();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-6xl p-4 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <img src={logo} alt="City Center of Media" className="h-7 w-7" />
            <span>City Center of Media</span>
          </Link>
          <nav className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 items-center">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <ThemeToggle />
            <button
              className={`btn ${demo ? 'btn-outline' : 'btn-primary'} ml-2`}
              onClick={() => (demo ? disableDemo() : enableDemo())}
              type="button"
            >
              {demo ? 'Disable Demo' : 'Enable Demo'}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">{children}</main>
      <DemoToolbar />
    </div>
  );
}

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Navigate to="/login" replace /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />

      {/* Admin */}
      <Route path="/admin" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminDashboard /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/students" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminStudents /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/students/add" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminStudentsAdd /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/teachers" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminTeachers /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/teachers/add" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminTeachersAdd /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/courses" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminCoursesList /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/courses/add" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminCoursesAdd /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/fees" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminFees /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/exams" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminExams /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/timetable" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminTimetable /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/attendance/students" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminAttendanceStudents /></DashboardLayout></RoleGuard>} />
      <Route path="/admin/attendance/teachers" element={<RoleGuard roles={["admin"]}><DashboardLayout role="admin"><AdminAttendanceTeachers /></DashboardLayout></RoleGuard>} />

      {/* Teacher */}
      <Route path="/teacher" element={<RoleGuard roles={["teacher"]}><DashboardLayout role="teacher"><TeacherDashboard /></DashboardLayout></RoleGuard>} />
      <Route path="/teacher/attendance" element={<RoleGuard roles={["teacher"]}><DashboardLayout role="teacher"><TeacherAttendance /></DashboardLayout></RoleGuard>} />
      <Route path="/teacher/timetable" element={<RoleGuard roles={["teacher"]}><DashboardLayout role="teacher"><TeacherTimetable /></DashboardLayout></RoleGuard>} />
      <Route path="/teacher/marks" element={<RoleGuard roles={["teacher"]}><DashboardLayout role="teacher"><TeacherMarks /></DashboardLayout></RoleGuard>} />
      <Route path="/teacher/profile" element={<RoleGuard roles={["teacher"]}><DashboardLayout role="teacher"><TeacherProfile /></DashboardLayout></RoleGuard>} />

      {/* Student */}
      <Route path="/student" element={<RoleGuard roles={["student"]}><DashboardLayout role="student"><StudentDashboard /></DashboardLayout></RoleGuard>} />
      <Route path="/student/timetable" element={<RoleGuard roles={["student"]}><DashboardLayout role="student"><StudentTimetable /></DashboardLayout></RoleGuard>} />
      <Route path="/student/results" element={<RoleGuard roles={["student"]}><DashboardLayout role="student"><StudentResults /></DashboardLayout></RoleGuard>} />
      <Route path="/student/fees" element={<RoleGuard roles={["student"]}><DashboardLayout role="student"><StudentFees /></DashboardLayout></RoleGuard>} />
      <Route path="/student/profile" element={<RoleGuard roles={["student"]}><DashboardLayout role="student"><StudentProfile /></DashboardLayout></RoleGuard>} />

      <Route path="*" element={<Layout><div>Not Found</div></Layout>} />
    </Routes>
  );
}

