import React, { useState, useEffect } from "react";
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
import Evaluate from "./pages/student/Evaluate";
import ConfirmJobs from "./pages/admin/ConfirmJobs";
import EventStudent from "./pages/student/EventStudent";
import ApplicationsHistory from "./pages/student/ApplicationsHistory";
import {
  fetchStudentProfile,
  fetchEmployerProfile,
  fetchJobDetails,
  fetchApplications,
  fetchJobs,
  fetchEvents,
  fetchReview,
  fetchEmployerReview
} from "./services/api";
import JobCard from "./pages/student/JobCard";

const App = () => {
  const [profile, setProfile] = useState(null);
  const [eProfile, setEProfile] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [applications, setApplications] = useState([]); 
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] =useState([]);
  const [reviews, setReviews] = useState([]);
  const [EmployerReview, setEmployerReview] = useState([]);

  useEffect(() => {
    //duoc goi, lay du lieu tu API gia lap
    const fetchData = async () => {
      const studentProfile = await fetchStudentProfile();
      const employerProfile = await fetchEmployerProfile();
      const jobDetail = await fetchJobDetails();
      const applicationData = await fetchApplications(); 
      const jobData = await fetchJobs();
      const eventData = await fetchEvents();
      const reviewData = await fetchReview();
      const EmployerReviewData = await fetchEmployerReview();
      //cap nhat lai
      setProfile(studentProfile);
      setEProfile(employerProfile);
      setJobDetails(jobDetail);
      setApplications(applicationData);
      setJobs(jobData);
      setEvents(eventData);
      setReviews(reviewData);
      setEmployerReview(EmployerReviewData);
    };
    fetchData();
    //dependency array se chay 1 lan
  }, []);

  const handleSave = (updatedProfile) => {
    // Update logic for saving profiles or job details
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
        <Route path="/studentprofile" element={<StudentProfile profileData={profile} reviews={reviews} />} />
        {/* Truyền dũliệu và hàm cập nhật xuống profileform */}
        <Route path="/profileform" element={<ProfileForm initialData={profile} onSave={handleSave} />} />
        <Route path="/employerprofile" element={<EmployerProfile profileData={eProfile} EmployerReview={EmployerReview}/>} />
        <Route path="/editprofile" element={<EditProfile initialData={eProfile} onSave={handleSave} />} />
        <Route path="/findjob" element={<FindJob jobs={jobs} />} />
        <Route path="/jobdetail" element={<JobDetail job={jobDetails} />} />
        <Route path="/editjob" element={<EditJob editJob={jobDetails} onSave={handleSave} />} />
        <Route path="/manageposts" element={<ManagePosts jobs={jobs} />} />
        <Route path="/review" element={<Review EmployerReview={EmployerReview} />} />
        <Route path="/eventmanagement" element={<EventManagement events={events} />} />
        <Route path="/evaluate" element={<Evaluate initialReviews={reviews} />} /> 
        <Route path="/confirmJobs" element={<ConfirmJobs jobs={jobs}/>}/>
        <Route path="/eventstudent" element={<EventStudent events={events} />} />
        <Route path="/applicationhistory" element={<ApplicationsHistory applications={applications} />} />
        <Route path="/jobcard" element={<JobCard/>} jobs={jobs}/>
      </Routes>
    </Router>
  );
};

export default App;
