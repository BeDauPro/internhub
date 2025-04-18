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
import PrivateRoute from "./components/auth/PrivateRoute";
import useAuth from "./hooks/useAuth";
import ForgotPassword from "./pages/ForgotPassword";
import {
    fetchStudentProfile,
    fetchEmployerProfile,
    fetchJobDetails,
    fetchApplications,
    fetchJobs,
    fetchEvents,
    fetchReview,
    fetchEmployerReview,
    fetchApplicationEmployer
} from "./services/api";
import JobCard from "./pages/student/JobCard";
import ApplicationEmployer from "./pages/employer/ApplicationEmployer";
import StudentManagement from "./pages/admin/StudentManagement";
import AccountManagement from "./pages/admin/AccountManagement";
import CreateAccount from "./pages/admin/CreateAccount";
import NavbarWrapper from "./components/NavbarWrapper";

const App = () => {
    const { isAuthenticated, role } = useAuth();

    const [profile, setProfile] = useState(null);
    const [eProfile, setEProfile] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [events, setEvents] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [EmployerReview, setEmployerReview] = useState([]);
    const [applicationEmployer, setApplicationEmployer] = useState([]);
    const [managementStudents, setManagementStudents] = useState([]);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");
        if (!token || !userRole) {
            localStorage.clear();
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const studentProfile = await fetchStudentProfile();
            const employerProfile = await fetchEmployerProfile();
            const jobDetail = await fetchJobDetails();
            const applicationData = await fetchApplications();
            const jobData = await fetchJobs();
            const eventData = await fetchEvents();
            const reviewData = await fetchReview();
            const EmployerReviewData = await fetchEmployerReview();
            const applicationEmployerData = await fetchApplicationEmployer();
            const studentData = await fetchApplicationEmployer();

            setProfile(studentProfile);
            setEProfile(employerProfile);
            setJobDetails(jobDetail);
            setApplications(applicationData);
            setJobs(jobData);
            setEvents(eventData);
            setReviews(reviewData);
            setEmployerReview(EmployerReviewData);
            setApplicationEmployer(applicationEmployerData);
            setManagementStudents(studentData);
        };

        fetchData();
    }, []);

    const handleSave = (updatedProfile) => {
        setProfile(updatedProfile);
        setEProfile(updatedProfile);
        setJobDetails(updatedProfile);
    };

    return (
        <Router>
            {window.location.pathname !== "/login" &&
            window.location.pathname !== "/register" &&
            window.location.pathname !== "/forgotpassword" && <NavbarWrapper />}

            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />

                <Route
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["Student"]}
                            role={role}
                        />
                    }
                >
                    <Route
                        path="/studentprofile"
                        element={<StudentProfile profileData={profile} reviews={reviews} />}
                    />
                    <Route path="/findjob" element={<FindJob jobs={jobs} />} />
                    <Route path="/evaluate" element={<Evaluate initialReviews={reviews} />} />
                    <Route path="/eventstudent" element={<EventStudent events={events} />} />
                    <Route
                        path="/applicationhistory"
                        element={<ApplicationsHistory applications={applications} />}
                    />
                </Route>

                <Route
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["Employer"]}
                            role={role}
                        />
                    }
                >
                    <Route
                        path="/employerprofile"
                        element={<EmployerProfile profileData={eProfile} EmployerReview={EmployerReview} />}
                    />
                    <Route
                        path="/editjob"
                        element={<EditJob editJob={jobDetails} onSave={handleSave} />}
                    />
                    <Route path="/editjob/:id" element={<EditJob onSave={handleSave} />} />
                    <Route path="/manageposts" element={<ManagePosts jobs={jobs} />} />
                    <Route
                        path="/applicationemployer"
                        element={<ApplicationEmployer applicationData={applicationEmployer} />}
                    />
                </Route>

                <Route
                    element={
                        <PrivateRoute
                            isAuthenticated={isAuthenticated}
                            allowedRoles={["Admin"]}
                            role={role}
                        />
                    }
                >
                    <Route path="/eventmanagement" element={<EventManagement events={events} />} />
                    <Route
                        path="/studentmanagement"
                        element={<StudentManagement studentsData={managementStudents} />}
                    />
                    <Route
                        path="/accountmanagement"
                        element={<AccountManagement accounts={accounts} />}
                    />
                    <Route path="/confirmjobs" element={<ConfirmJobs jobs={jobs} />} />
                    <Route
                        path="/createaccount"
                        element={
                            <CreateAccount
                                onAddAccount={(account) =>
                                    setAccounts((prev) => [account, ...prev])
                                }
                            />
                        }
                    />
                </Route>

                <Route path="*" element={<NotFound />} />
                <Route path="/unauthorized" element={<h1>403 - Không có quyền truy cập</h1>} />
            </Routes>
        </Router>
    );
};

export default App;
