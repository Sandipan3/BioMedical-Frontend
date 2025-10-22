import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import React from "react";
import Register from "../pages/Register";
import AdminLayout from "./AdminLayout";
import DoctorLayout from "./DoctorLayout";
import PatientLayout from "./PatientLayout";
import AdminDashboard from "../pages/AdminDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import PatientDashboard from "../pages/PatientDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      // Public Routes
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/unauthorized",
        element: (
          <div className="min-h-screen flex items-center justify-center">
            unauthorized
          </div>
        ),
      },

      // Admin only routes - a/
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/a",
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              //{ path: "dashboard", element: <div>Admin DashBoard</div> },
            ],
          },
        ],
      },
      // Doctor only routes - d/
      {
        element: <ProtectedRoute allowedRoles={["doctor"]} />,
        children: [
          {
            path: "/d",
            element: <DoctorLayout />,
            children: [
              { index: true, element: <DoctorDashboard /> },
              //{ path: "create", element: <CreateCourse /> },
            ],
          },
        ],
      },
      // patient only routes - p/
      {
        element: <ProtectedRoute allowedRoles={["patient"]} />,
        children: [
          {
            path: "/p",
            element: <PatientLayout />,
            children: [
              { index: true, element: <PatientDashboard /> },
              //{ path: "add-report", element: <AddReport /> },
              //{ path: "dashboard", element: <div>Admin student</div> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center">
        404 - Page not found!
      </div>
    ),
  },
]);

export default router;
