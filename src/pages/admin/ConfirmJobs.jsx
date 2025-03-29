import React, { useState, useEffect } from 'react';
import '../../styles/components/jobcard.scss';
import '../../styles/pages/admin/ConfirmJobs.scss';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../components/admin/NavbarAdmin';
import Footer from '../../components/Footer';

const ConfirmJobs = ({ searchResults, jobs }) => {
  const [visibleJobs, setVisibleJobs] = useState(8);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedTitle, setSelectedTitle] = useState("All");

  const navigate = useNavigate();

  const filteredJobs = jobs.filter((job) =>
    (selectedType === "All" || job.type === selectedType) &&
    (selectedLocation === "All" || job.location === selectedLocation) &&
    (selectedTitle === "All" || job.title === selectedTitle) &&
    (!searchResults ||
      (!searchResults.searchInput || job.title.toLowerCase().includes(searchResults.searchInput.toLowerCase())) &&
      (!searchResults.selectedLocation || job.location === searchResults.selectedLocation))
  );

  const handleLoadMore = () => {
    setVisibleJobs((prevVisibleJobs) => prevVisibleJobs + 8);
  };

  return (
    <>
    <NavbarAdmin/>
    <div className="JobListContainer job-list-background" style={{ marginTop: '10vh' }}>
      <h2>Danh sách công việc cần xác nhận</h2>
      <div className="filters">
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          <option value="All">Tất cả loại hình</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
        </select>

        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="All">Tất cả địa điểm</option>
          {[...new Set(jobs.map((job) => job.location))].map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}>
          <option value="All">Tất cả công việc</option>
          {[...new Set(jobs.map((job) => job.title))].map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      <div className="jobList">
        {filteredJobs.slice(0, visibleJobs).map((job) => (
          <div key={job.id} className="jobCard animate-slide-up">
            <div className="jobHeader" onClick={() => navigate("/jobdetail")}>
              <span className="jobTitle">{job.title}</span>
              <span className={`jobType ${job.typeClass}`}>{job.type}</span>
            </div>
            <div className="jobBody" onClick={() => navigate("/jobdetail")}>
              <img src={job.logo} alt={job.company} className="jobLogo" />
              <div>
                <span className="companyName">{job.company}</span>
                <div className="jobLocation">📍 {job.location}</div>
              </div>
            </div>
            <div className="jobFooter">
              <button className="btn btn-success">
                <i className="fas fa-check"></i> Duyệt
              </button>
              <button className="btn btn-danger">
                <i className="fas fa-times"></i> Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
      {visibleJobs < filteredJobs.length && (
        <button className="loadMore" onClick={handleLoadMore}>
          Xem nhiều hơn
        </button>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default ConfirmJobs;
