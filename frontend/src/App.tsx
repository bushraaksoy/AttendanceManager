import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import {
  publicRoutes,
  adminRoutes,
  teacherRoutes,
  studentRoutes,
  userRoutes,
} from "./routes/routes.jsx";
import PrivateRoutes from "./PrivateRoutes";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.element />}
            />
          ))}

          {/* Protected Routes with Dashboard Layout */}
          <Route
            element={<PrivateRoutes roles={["admin", "teacher", "student"]} />}
          >
            <Route element={<DashboardLayout />}>
              {/* Admin Routes */}
              {adminRoutes.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.element />}
                />
              ))}

              {/* Teacher Routes */}
              {teacherRoutes.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.element />}
                />
              ))}

              {/* Student Routes */}
              {studentRoutes.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.element />}
                />
              ))}

              {/* General User Routes */}
              {userRoutes.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.element />}
                />
              ))}
            </Route>
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
