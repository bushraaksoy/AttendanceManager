import React from "react";
import { Route, Routes } from "react-router-dom";
import { adminRoutes } from "./routes";
import PrivateRoutes from "../PrivateRoutes";

const CustomAdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes roles={["ADMIN"]} />}>
        {adminRoutes.map((route) => (
          <Route key={route.id} path={route.path} element={<route.element />} />
        ))}
      </Route>
    </Routes>
  );
};

export default CustomAdminRoutes;
