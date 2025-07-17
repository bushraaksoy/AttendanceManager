import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  Building,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem = ({ icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link to={to}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
      >
        <div className="text-xl">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
};

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<"admin" | "teacher" | "student">(
    "admin",
  ); // Default to admin for demo
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      {
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
        to: "/dashboard",
      },
      {
        icon: <Settings size={20} />,
        label: "Settings",
        to: "/settings",
      },
    ];

    const adminItems = [
      {
        icon: <Users size={20} />,
        label: "Users",
        to: "/users",
      },
      {
        icon: <Building size={20} />,
        label: "Faculties",
        to: "/faculties",
      },
      {
        icon: <Building2 size={20} />,
        label: "Departments",
        to: "/departments",
      },
      {
        icon: <BookOpen size={20} />,
        label: "Courses",
        to: "/courses",
      },
    ];

    const teacherItems = [
      {
        icon: <BookOpen size={20} />,
        label: "My Courses",
        to: "/my-courses",
      },
      {
        icon: <CalendarDays size={20} />,
        label: "Lessons",
        to: "/lessons",
      },
      {
        icon: <ClipboardList size={20} />,
        label: "Attendance",
        to: "/attendance",
      },
    ];

    const studentItems = [
      {
        icon: <BookOpen size={20} />,
        label: "My Courses",
        to: "/my-courses",
      },
      {
        icon: <CalendarDays size={20} />,
        label: "Schedule",
        to: "/schedule",
      },
      {
        icon: <ClipboardList size={20} />,
        label: "My Attendance",
        to: "/my-attendance",
      },
    ];

    switch (userRole) {
      case "admin":
        return [...commonItems, ...adminItems];
      case "teacher":
        return [...commonItems, ...teacherItems];
      case "student":
        return [...commonItems, ...studentItems];
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0 md:w-20"} bg-card border-r border-border transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <div
            className={`flex items-center gap-2 ${!sidebarOpen && "md:hidden"}`}
          >
            <GraduationCap className="text-primary" size={28} />
            <h1 className={`font-bold text-xl ${!sidebarOpen && "md:hidden"}`}>
              UniAttend
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <div className="mt-2 px-4">
          <div
            className={`flex items-center gap-3 ${!sidebarOpen && "md:justify-center"}`}
          >
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div className={`${!sidebarOpen && "md:hidden"}`}>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground capitalize">
                {userRole}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <nav className="flex-1 overflow-y-auto px-2">
          {navigationItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={currentPath === item.to}
            />
          ))}
        </nav>

        <div className="p-4">
          <Button
            variant="outline"
            className={`w-full flex items-center gap-2 ${!sidebarOpen && "md:justify-center md:px-0"}`}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className={`${!sidebarOpen && "md:hidden"}`}>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>

          <div className="md:hidden" />

          <div className="flex items-center gap-4">
            {/* Role selector for demo purposes */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Role:</span>
              <select
                className="text-sm bg-background border border-input rounded-md px-2 py-1"
                value={userRole}
                onChange={(e) =>
                  setUserRole(e.target.value as "admin" | "teacher" | "student")
                }
              >
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
