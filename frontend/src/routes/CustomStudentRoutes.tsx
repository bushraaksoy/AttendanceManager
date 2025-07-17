import React from "react";
import { Route, Routes } from "react-router-dom";
import { studentRoutes } from "./routes";
import PrivateRoutes from "../PrivateRoutes";

const CustomStudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes roles={["STUDENT"]} />}>
        {studentRoutes.map((route) => (
          <Route key={route.id} path={route.path} element={<route.element />} />
        ))}
      </Route>
    </Routes>
  );
};

export default CustomStudentRoutes;
