import React from "react";
import { Routes, BrowserRouter, Route, Navigate} from "react-router-dom";
import Cookies from 'js-cookie';

import Login from "./pages/login/login";
import Dashboard from "./pages/dashboard/dashboard";
import User from "./pages/user.js/user";
import UserRegister from "./pages/user.js/register/register"
import EditUser from "./pages/user.js/edit/edit";
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
import History from "./pages/history/history";
import DetailedHistory from "./pages/history/detailedHistory";
import RegisterHistory from "./pages/history/register/register";
import ImportHistory from "./pages/history/importHistory";

import withAuth from "./utils/privateRoute";

const ProtectedDashboard = withAuth(Dashboard);

const ProtectedUser = withAuth(User);
const ProtectedUserRegister = withAuth(UserRegister);
const ProtectedUserEdit = withAuth(EditUser);

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

const ProtectedHistory = withAuth(History);
const ProtectedDetailedHistory = withAuth(DetailedHistory)
const ProtectedRegisterHistory = withAuth(RegisterHistory)
const ProtectedImportHistory = withAuth(ImportHistory)


function AllRoutes() {

  const token = Cookies.get('token');


  return (

    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedDashboard />} />

        <Route path="/user" element={<ProtectedUser />} />
        <Route path="/user/register" element={<ProtectedUserRegister />} />
        <Route path="/user/edit/:id" element={<ProtectedUserEdit />} />

        <Route path="/permission" element={<ProtectedPermission />} />
        <Route path="/permission/register" element={<ProtectedRegisterPermission />} />
        <Route path="/permission/:id/services" element={<ProtectedPermissionServices />} />

        <Route path="/lineup" element={<ProtectedLineup />} />
        <Route path="/lineup/:id" element={<ProtectedDetailedLineup />} />

        <Route path="/smtp" element={<ProtectedSmtp />} />

        <Route path="/service" element={<ProtectedService />} />
        <Route path="/service/register" element={<ProtectedRegisterService />} />
        
        <Route path="/report" element={<ProtectedReport />} />
        <Route path="/report/:id" element={<DetailedReport />} />

        <Route path="/history" element={<ProtectedHistory />} />
        <Route path="/history/import/:id" element={<ProtectedImportHistory />} />
        <Route path="/history/:id" element={<ProtectedDetailedHistory />} />
        <Route path="/history/register" element={<ProtectedRegisterHistory />} />

        <Route path="*" element={<Navigate to ={token ? "/dashboard" : "/"} />} /> 

      </Routes>
    </BrowserRouter>
  );
}

export default AllRoutes;