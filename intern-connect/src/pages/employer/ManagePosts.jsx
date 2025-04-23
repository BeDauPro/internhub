import React, { useState, useEffect } from 'react';
import '../../styles/components/jobcard.scss';
import '../../styles/pages/employer/manageposts.scss';
import NavbarEmployer from '../../components/employer/NavbarEmployer';
import Footer from '../../components/Footer';
import { useNavigate } from "react-router-dom";
import { getEmployerJobs, deleteJob } from '../../services/JobPostingApi';

const ManagePosts = () => {
  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(8);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedTitle, setSelectedTitle] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch employer jobs when component mounts
  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        setIsLoading(true);
        const jobsData = await getEmployerJobs();

        // Transform jobs to match the component's structure
        const transformedJobs = jobsData.map(job => ({
          id: job.jobPostingId || job.id,
          title: job.jobTitle,
          type: job.workType,
          typeClass: job.workType === 'Full-time' ? 'fullTime' : 'partTime',
          logo: job.companyLogo || '/default-logo.png',
          company: job.companyName || 'Công ty',
          location: job.location,
          quantity: job.vacancies || 1,
          date: new Date(job.createdAt || job.postedAt || job.applicationDeadline).toLocaleDateString(),
          status: job.status || 'Pending'
        }));

        setJobs(transformedJobs);
        setError(null);
      } catch (err) {
        console.error("Error fetching employer jobs:", err);
        setError("Không thể tải danh sách công việc của bạn");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployerJobs();
  }, []);

  // Check for updates from history state
  useEffect(() => {
    const updatedJob = window.history.state?.usr?.updatedJob;
    if (updatedJob) {
      const existingIndex = jobs.findIndex((job) => job.id === updatedJob.id);
      if (existingIndex !== -1) {
        setJobs(prevJobs => {
          const newJobs = [...prevJobs];
          newJobs[existingIndex] = updatedJob;
          return newJobs;
        });
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

  // Cập nhật hàm handleViewDetails để điều hướng đến URL với id
  const handleViewDetails = (jobId) => {
    navigate(`/editjob/${jobId}`);
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <>
      <header className="manageposts-header w3-display-container w3-grayscale-min" style={{ height: '100vh', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'black', opacity: 0.5, zIndex: 1 }}></div>
        <div className="w3-display-left w3-text-white" style={{ padding: '48px', fontFamily: 'Georgia, serif', fontSize: '1.2em', position: 'relative', zIndex: 2, margin: '100px' }}>
          <span className="w3-jumbo w3-hide-small" style={{ fontSize: '2em', fontWeight: 'bold' }}>Quản lý bài đăng của bạn</span><br />
          <span className="w3-xxlarge w3-hide-large w3-hide-medium" style={{ fontSize: '3em', fontWeight: 'bold' }}>Sẵn sàng tìm kiếm nguồn nhân lực mới</span><br />
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
                transition: 'transform 0.2s ease',
                marginTop: '10px'
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
        <h2>Danh sách công việc của bạn</h2>
        <div className="filters">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="All">Tất cả loại hình</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
          </select>

          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="All">Tất cả địa điểm</option>
            {[...new Set(jobs.map(job => job.location))].filter(Boolean).map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}>
            <option value="All">Tất cả công việc</option>
            {[...new Set(jobs.map(job => job.title))].filter(Boolean).map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="jobList">
            {filteredJobs.slice(0, visibleJobs).map((job) => (
              <div key={job.id} className="jobCard animate-slide-up">
                <div className="jobHeader">
                  <span className="jobTitle">
                    {job.title.length > 20 ? `${job.title.substring(0, 17)}...` : job.title}
                  </span>
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
                  <button
                    className="btn btn-dark"
                    onClick={() => handleViewDetails(job.id)}
                    style={{
                      backgroundColor: '#333',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 10px',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-jobs-message">
            <p>Bạn chưa có bài đăng tuyển dụng nào</p>
          </div>
        )}

        {visibleJobs < filteredJobs.length && (
          <button className="loadMore" onClick={handleLoadMore}>Xem nhiều hơn</button>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ManagePosts;