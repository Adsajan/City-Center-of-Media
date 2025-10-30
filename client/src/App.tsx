import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/auth";
//import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
//import InstructorDashboardpage from "./pages/instructor";
//import StudentViewCommonLayout from "./components/student-view/common-layout";
//import StudentHomePage from "./pages/student/home";
//import NotFoundPage from "./pages/not-found";
// import AddNewCoursePage from "./pages/instructor/add-new-course";
// import StudentViewCoursesPage from "./pages/student/courses";
// import StudentViewCourseDetailsPage from "./pages/student/course-details";
// import PaypalPaymentReturnPage from "./pages/student/payment-return";
// import StudentCoursesPage from "./pages/student/student-courses";
// import StudentViewCourseProgressPage from "./pages/student/course-progress";

function App() {
  const { auth } = useContext(AuthContext);
    
  return (
    <ThemeProvider storageKey="theme">
      <BrowserRouter>
        <AuthProvider>
          <RoutesApp />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
 
}

