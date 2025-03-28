import React, { useState, useEffect } from 'react';
import '../../styles/components/jobcard.scss';
import { jobs } from '../student/JobCard';
import "../../components/employer/NavbarEmployer"
import NavbarEmployer from '../../components/employer/NavbarEmployer';
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";

const ManagePosts = () => {
  const [visibleJobs, setVisibleJobs] = useState(8);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedTitle, setSelectedTitle] = useState("All");
  const [jobPosts, setJobPosts] = useState(jobs);
  const navigate = useNavigate();

  useEffect(() => {
    const updatedJob = window.history.state?.usr?.updatedJob;
    if (updatedJob) {
      setJobPosts((prevJobs) => {
        const existingIndex = prevJobs.findIndex((job) => job.id === updatedJob.id);
        if (existingIndex !== -1) {
          const updatedJobs = [...prevJobs];
          updatedJobs[existingIndex] = updatedJob;
          return [updatedJob, ...updatedJobs.filter((_, index) => index !== existingIndex)];
        }
        return [updatedJob, ...prevJobs]; 
      });
    }
  }, []);

  const filteredJobs = jobPosts.filter((job) =>
    (selectedType === "All" || job.type === selectedType) &&
    (selectedLocation === "All" || job.location === selectedLocation) &&
    (selectedTitle === "All" || job.title === selectedTitle)
  );

  const handleLoadMore = () => {
    setVisibleJobs(prevVisibleJobs => prevVisibleJobs + 8);
  };

  const handleAddNewPost = () => {
    navigate("/editjob", { state: { clearForm: true } });
  };


  return (
    <>
    <NavbarEmployer/>
      <div className="JobListContainer" style={{ marginTop: '20vh'}}>
        <div className="header">
          <h2>Quản lý bài đăng</h2>
          <button className="addNewPost" onClick={handleAddNewPost}>
            <span className="icon">+</span> Add New Posts
          </button>
        </div>
        <div className="filters">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="All">Tất cả loại hình</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
          </select>

          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="All">Tất cả địa điểm</option>
            {[...new Set(jobs.map(job => job.location))].map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}>
            <option value="All">Tất cả công việc</option>
            {[...new Set(jobs.map(job => job.title))].map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>
        <div className="jobList">
          {filteredJobs.slice(0, visibleJobs).map((job) => (
            <div key={job.id} className="jobCard animate-slide-up">
              <div className="jobHeader">
                <span className="jobTitle">{job.title}</span>
                <span className={`jobType ${job.typeClass}`}>
                  {job.type}
                </span>
              </div>
              <div className="jobBody">
                <img src={job.logo} alt={job.company} className="jobLogo" />
                <div>
                  <span className="companyName">{job.company}</span>
                  <div className="jobLocation">📍 {job.location}</div>
                </div>
              </div>
              <div className="jobFooter">
                <span>Số lượng tuyển: {job.quantity}</span>
                <button className="viewDetails" onClick={() => navigate("/jobdetail")}>Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
        {visibleJobs < filteredJobs.length && (
          <button className="loadMore" onClick={handleLoadMore}>Xem nhiều hơn</button>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default ManagePosts;
