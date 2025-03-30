import React, { useState, useEffect } from 'react';
import '../../styles/components/jobcard.scss';
import '../../styles/pages/employer/manageposts.scss';
import NavbarEmployer from '../../components/employer/NavbarEmployer';
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";

const ManagePosts = ({ jobs }) => {
  const [visibleJobs, setVisibleJobs] = useState(8);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedTitle, setSelectedTitle] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    const updatedJob = window.history.state?.usr?.updatedJob;
    if (updatedJob) {
      const existingIndex = jobs.findIndex((job) => job.id === updatedJob.id);
      if (existingIndex !== -1) {
        jobs[existingIndex] = updatedJob;
      }
    }
  }, [jobs]);

  const filteredJobs = jobs.filter((job) =>
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
      <NavbarEmployer />
      <header className="manageposts-header w3-display-container w3-grayscale-min" style={{ height: '100vh', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'black', opacity: 0.5, zIndex: 1 }}></div>
        <div className="w3-display-left w3-text-white" style={{ padding: '48px', fontFamily: 'Georgia, serif', fontSize: '1.2em', position: 'relative', zIndex: 2,margin: '100px'}}>
          <span className="w3-jumbo w3-hide-small" style={{ fontSize: '2em', fontWeight: 'bold' }}>Quản lý bài đăng của bạn</span><br />
          <span className="w3-xxlarge w3-hide-large w3-hide-medium" style={{ fontSize: '3em', fontWeight: 'bold' }}>Quản lý bài đăng của bạn</span><br />
          <span className="w3-large" style={{ fontSize: '1.5em' }}>Tạo, chỉnh sửa và quản lý các bài đăng tuyển dụng của bạn một cách dễ dàng.</span>
          <p>
            <button 
              className="w3-button w3-white w3-padding-large w3-large w3-margin-top" 
              style={{ 
                backgroundColor: '#007BFF',
                color: 'white', 
                fontWeight: 'bold', 
                padding: '10px', 
                borderRadius: '15px', 
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2), inset 0px -2px 4px rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }} 
              onClick={handleAddNewPost}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Thêm bài đăng mới
            </button>
          </p>
        </div>

      </header>
      <div className="JobListContainer" style={{ marginTop: '30px' }}>
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
      <Footer />
    </>
  );
};

export default ManagePosts;
