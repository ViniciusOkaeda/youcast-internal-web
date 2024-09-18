import React from "react";
import { Routes, BrowserRouter, Route, Navigate} from "react-router-dom";
import Cookies from 'js-cookie';

import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import User from "./pages/user.js/user";
import Permission from "./pages/permission/permission";
import Lineup from "./pages/lineup/lineup";
import Smtp from "./pages/smtp/smtp";
import Service from "./pages/service/service";
import Report from "./pages/report/report";
import DetailedReport from "./pages/report/detailedReport";

import withAuth from "./utils/privateRoute";

const ProtectedDashboard = withAuth(Dashboard);
const ProtectedUser = withAuth(User);
const ProtectedPermission = withAuth(Permission);
const ProtectedLineup = withAuth(Lineup);
const ProtectedSmtp = withAuth(Smtp);
const ProtectedService = withAuth(Service);
const ProtectedReport = withAuth(Report);
const ProtectedDetailReport = withAuth(DetailedReport);

function AllRoutes() {

  const token = Cookies.get('token');


  return (

    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/user" element={<ProtectedUser />} />
        <Route path="/permission" element={<ProtectedPermission />} />
        <Route path="/lineup" element={<ProtectedLineup />} />
        <Route path="/smtp" element={<ProtectedSmtp />} />
        <Route path="/service" element={<ProtectedService />} />
        <Route path="/report" element={<ProtectedReport />} />
        <Route path="/report/:id" element={<ProtectedDetailReport />} />

        <Route path="*" element={<Navigate to ={token ? "/dashboard" : "/"} />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default AllRoutes;