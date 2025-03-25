import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StudentProfile from "./pages/student/StudentProfile";
import ProfileForm from "./pages/student/ProfileForm";
import "./styles/pages/student/profileform.scss";
import Login from "./pages/Login";
import FindJob from "./pages/student/FindJob";
import Navbar from "./components/students/Navbar";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import EmployerProfile from "./pages/employer/EmployerProfile";
import EditProfile from "./pages/employer/EditProfile";
import JobDetail from "./pages/student/JobDetail";
import EditJob from "./pages/employer/EditJob";
import ManagePosts from "./pages/employer/ManagePosts";
import Review from "./pages/employer/Review";
import EventManagement from "./pages/admin/EventManagement";
const App = () => {
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
  const [eProfile, setEProfile] = useState({
    companyName: "FPT Software",
    companyID: "fpt123",
    companyEmail: "contact@fptsoftware.com",
    addresscom: "Hà Nội, Việt Nam",
    phone: "+84-24-7300-7300",
    website: "https://www.fpt-software.com",
    since: "1999",
    totalEmployee: "27000",
    introduction: "FPT Software is a leading IT services provider in Southeast Asia, specializing in digital transformation, software development, and IT outsourcing.",
    services: [
      "Digital Transformation Consulting",
      "Cloud Migration",
      "AI & Data Analytics",
      "Software Development",
      "Managed Services",
    ]
  });
  const [jobDetails, setJobDetails] = useState({
    companyName: "FPT Software",
    location: "Hà Nội, Việt Nam",
    field: "Information Technology",
    jobTitle: "Software Engineer Intern",
    jobType: "Full-time",
    salary: "1,000,000 - 3,000,000 VND",
    experience: "No experience required",
    jobDescription: "Assist in developing and maintaining software applications. Collaborate with the team to deliver high-quality solutions.Assist in developing and maintaining software applications. Collaborate with the team to deliver high-quality solutions.",
    jobRequirements: "Basic knowledge of programming languages such as Java, Python, or C#. Good problem-solving skills.",
    languages: ["English", "Vietnamese"],
    vacancies: 5,
    deadline: "2023-12-31",
  });

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
    setEProfile(updatedProfile);
    setJobDetails(updatedProfile);
  };


  return (
<Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={<Login onLogin={() => <Navigate to="/studentprofile" />} />}
        />
        <Route path="/register" element={<Register />} />
        {/* truyền dữ liệu từ app.js xuống studentprofile.jsx */}
        <Route path="/studentprofile" element={<StudentProfile profileData={profile} />} />
        {/* Truyền dũliệu và hàm cập nhật xuống profileform */}
        <Route path="/profileform" element={<ProfileForm initialData={profile} onSave={handleSave} />} />
        <Route path="/employerprofile" element={<EmployerProfile profileData={eProfile} />} />
        <Route path="/editprofile" element={<EditProfile initialData={eProfile} onSave={handleSave} />} />
        <Route path="/findjob" element={<FindJob />} />
        <Route path="/jobdetail" element={<JobDetail job={jobDetails} />} />
        <Route path="/editjob" element={<EditJob editJob={jobDetails} onSave={handleSave} />} />
        <Route path="/manageposts" element={<ManagePosts />} />
        <Route path="/review" element={<Review />} />
        <Route path="/eventmanagement" element={<EventManagement/>}/>
      </Routes>
    </Router>
  );
};

export default App;
