import Home from "../components/home";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import AttendanceTable from "../components/dashboard/AttendanceTable";
import CourseManagement from "../components/dashboard/CourseManagement";
import Schedule from "../components/dashboard/Schedule";

// Public routes - accessible without authentication
export const publicRoutes = [
  {
    id: "home",
    path: "/",
    element: Home,
  },
];

// Admin routes - only accessible by admin users
export const adminRoutes = [
  {
    id: "admin-dashboard",
    path: "/dashboard",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p>Welcome to the admin dashboard</p>
      </div>
    ),
  },
  {
    id: "admin-users",
    path: "/users",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p>Admin user management interface</p>
      </div>
    ),
  },
  {
    id: "admin-faculties",
    path: "/faculties",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Faculty Management</h1>
        <p>Admin faculty management interface</p>
      </div>
    ),
  },
  {
    id: "admin-departments",
    path: "/departments",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Department Management</h1>
        <p>Admin department management interface</p>
      </div>
    ),
  },
  {
    id: "admin-courses",
    path: "/courses",
    element: () => <CourseManagement userRole="admin" />,
  },
  {
    id: "admin-attendance",
    path: "/attendance",
    element: () => <AttendanceTable userRole="admin" />,
  },
  {
    id: "admin-settings",
    path: "/settings",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Admin settings interface</p>
      </div>
    ),
  },
];

// Teacher routes - only accessible by teacher users
export const teacherRoutes = [
  {
    id: "teacher-dashboard",
    path: "/dashboard",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p>Welcome to the teacher dashboard</p>
      </div>
    ),
  },
  {
    id: "teacher-courses",
    path: "/my-courses",
    element: () => <CourseManagement userRole="teacher" />,
  },
  {
    id: "teacher-lessons",
    path: "/lessons",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">My Lessons</h1>
        <p>Teacher lesson management interface</p>
      </div>
    ),
  },
  {
    id: "teacher-schedule",
    path: "/schedule",
    element: () => <Schedule userRole="teacher" />,
  },
  {
    id: "teacher-attendance",
    path: "/attendance",
    element: () => <AttendanceTable userRole="teacher" />,
  },
  {
    id: "teacher-settings",
    path: "/settings",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Teacher settings interface</p>
      </div>
    ),
  },
];

// Student routes - only accessible by student users
export const studentRoutes = [
  {
    id: "student-dashboard",
    path: "/dashboard",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p>Welcome to the student dashboard</p>
      </div>
    ),
  },
  {
    id: "student-courses",
    path: "/my-courses",
    element: () => <CourseManagement userRole="student" />,
  },
  {
    id: "student-schedule",
    path: "/schedule",
    element: () => <Schedule userRole="student" />,
  },
  {
    id: "student-attendance",
    path: "/my-attendance",
    element: () => <AttendanceTable userRole="student" />,
  },
  {
    id: "student-settings",
    path: "/settings",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Student settings interface</p>
      </div>
    ),
  },
];

// General user routes - accessible by all authenticated users
export const userRoutes = [
  {
    id: "profile",
    path: "/profile",
    element: () => (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>User profile interface</p>
      </div>
    ),
  },
];
