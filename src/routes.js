import React from "react";
import { Routes, BrowserRouter, Route, Navigate} from "react-router-dom";
import Cookies from 'js-cookie';

import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import User from "./pages/user.js/user";
import UserRegister from "./pages/user.js/register/register"
import Permission from "./pages/permission/permission";
import RegisterPermission from "./pages/permission/register/register";
import PermissionServices from "./pages/permission/permissionServices/permissionServices";
import Lineup from "./pages/lineup/lineup";
import Smtp from "./pages/smtp/smtp";
import Service from "./pages/service/service";
import RegisterService from "./pages/service/register/register";
import Report from "./pages/report/report";
import DetailedReport from "./pages/report/detailedReport";
import DetailedLineup from "./pages/lineup/detailedLineup";

import withAuth from "./utils/privateRoute";

const ProtectedDashboard = withAuth(Dashboard);

const ProtectedUser = withAuth(User);
const ProtectedUserRegister = withAuth(UserRegister);

const ProtectedPermission = withAuth(Permission);
const ProtectedRegisterPermission = withAuth(RegisterPermission)
const ProtectedPermissionServices = withAuth(PermissionServices)

const ProtectedLineup = withAuth(Lineup);
const ProtectedDetailedLineup = withAuth(DetailedLineup);

const ProtectedSmtp = withAuth(Smtp);

const ProtectedService = withAuth(Service);
const ProtectedRegisterService = withAuth(RegisterService)

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
        <Route path="/user/register" element={<ProtectedUserRegister />} />

        <Route path="/permission" element={<ProtectedPermission />} />
        <Route path="/permission/register" element={<ProtectedRegisterPermission />} />
        <Route path="/permission/:id/services" element={<ProtectedPermissionServices />} />

        <Route path="/lineup" element={<ProtectedLineup />} />
        <Route path="/lineup/:id" element={<ProtectedDetailedLineup />} />

        <Route path="/smtp" element={<ProtectedSmtp />} />

        <Route path="/service" element={<ProtectedService />} />
        <Route path="/service/register" element={<ProtectedRegisterService />} />
        
        <Route path="/report" element={<ProtectedReport />} />
        <Route path="/report/:id" element={<ProtectedDetailReport />} />

        <Route path="*" element={<Navigate to ={token ? "/dashboard" : "/"} />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default AllRoutes;