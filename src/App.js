import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudentProfile from "./pages/student/StudentProfile";
import ProfileForm from "./pages/student/ProfileForm";
import "./styles/pages/student/profileform.scss";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const App = () => {
  //chứa toàn bộ thông tin của bạn 
  const [profile, setProfile] = useState({
    name: "Nguyễn Đức",
    studentId: "21T1020310",
    status: "Thực tập",
    email: "tbnduc2k3@gmail.com",
    address: "26 Lê Trung Định, Đà Nẵng",
    phone: "0786490209",
    birthday: "06/01/2003",
    gender: "Nam",
    introduction:
      "Final-year Software Engineering student at the University of Sciences, Hue University.",
    education: [
      {
        institution: "University of Sciences, Hue University",
        details: "Final-year student majoring in Software Engineering.",
      },
    ],
    otherInfo: {
      github: "https://github.com/BeDauPro",
      gpa: "2.6",
      languages: "Tiếng Việt, Tiếng Anh",
    },
    skills: ["ASP.NET", "ReactJS", "Flutter", "SQL Server", "Figma"],
    cvUploaded: false,
  });
  //hàm cập nhật hồ sơ khi chỉnh sửa xong
  const handleSave = (updatedProfile) => {
    console.log("Updated profile:", updatedProfile); 
    setProfile(updatedProfile);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* truyền dữ liệu từ app.js xuống studentprofile.jsx */}
        <Route path="/studentprofile" element={<StudentProfile profileData={profile} />} />
        {/* Truyền dũliệu và hàm cập nhật xuống profileform */}
        <Route path="/profileform" element={<ProfileForm initialData={profile} onSave={handleSave} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
