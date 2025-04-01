import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import React from "react";
import StudentProfile from "../pages/student/StudentProfile";
import ProfileForm from "../pages/student/ProfileForm";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/studentprofile" element={<StudentProfile />} />
            <Route path="/profileform" element={<ProfileForm />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
