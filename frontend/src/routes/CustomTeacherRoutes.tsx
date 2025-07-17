import React from "react";
import { Route, Routes } from "react-router-dom";
import { teacherRoutes } from "./routes";
import PrivateRoutes from "../PrivateRoutes";

const CustomTeacherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes roles={["TEACHER"]} />}>
        {teacherRoutes.map((route) => (
          <Route key={route.id} path={route.path} element={<route.element />} />
        ))}
      </Route>
    </Routes>
  );
};

export default CustomTeacherRoutes;
