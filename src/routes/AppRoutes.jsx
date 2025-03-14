import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";
import JobDetail from "../pages/JobDetail";
import Applications from "../pages/Applications";
import EmployerDashboard from "../pages/EmployerDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound"; 
import PrivateRoute from "../components/PrivateRoute";
import React from "react";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
            <Route path="/employer" element={<PrivateRoute><EmployerDashboard /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
