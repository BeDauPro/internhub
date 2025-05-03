import React, { useState, useEffect } from 'react';
import '../../styles/components/jobcard.scss';
import '../../styles/pages/admin/ConfirmJobs.scss';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import { getPendingJobPostings, approveJobPosting, rejectJobPosting } from '../../services/adminApi';

const ConfirmJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(8);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedTitle, setSelectedTitle] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch pending jobs when component mounts
  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        setIsLoading(true);
        const pendingJobs = await getPendingJobPostings();

        // Transform jobs to match the original component's structure
        const transformedJobs = pendingJobs.map(job => ({
          id: job.jobPostingId,
          title: job.jobTitle,
          type: job.workType,
          typeClass: job.workType === 'Full-time' ? 'fullTime' : 'partTime',
          logo: job.companyLogo || '/default-logo.png',
          company: job.companyName,
          location: job.location,
          quantity: job.vacancies || 1,
          date: new Date(job.createdAt || job.postedAt).toLocaleDateString()
        }));

        setJobs(transformedJobs);
        setError(null);
      } catch (err) {
        console.error("Error fetching pending jobs:", err);
        setError("Không thể tải danh sách công việc cần xác nhận");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingJobs();
  }, []);

  // Handle approve job
  const handleApproveJob = async (jobId, event) => {
    // Ngăn chặn sự kiện lan truyền để không trigger handleViewDetails
    event.stopPropagation();

    try {
      await approveJobPosting(jobId);
      // Remove the job from the list after approval
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      alert("Đã duyệt công việc thành công!");
    } catch (err) {
      console.error("Error approving job:", err);
      alert("Không thể duyệt công việc: " + (err.data?.message || err.data?.error || "Đã xảy ra lỗi"));
    }
  };

  // Handle reject job
  const handleRejectJob = async (jobId, event) => {
    // Ngăn chặn sự kiện lan truyền để không trigger handleViewDetails
    event.stopPropagation();

    try {
      await rejectJobPosting(jobId);
      // Remove the job from the list after rejection
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      alert("Đã từ chối công việc thành công!");
    } catch (err) {
      console.error("Error rejecting job:", err);
      alert("Không thể từ chối công việc: " + (err.data?.message || err.data?.error || "Đã xảy ra lỗi"));
    }
  };

  // Duyệt qua ds jobs và giữ lại công việc phù hợp với filter
  const filteredJobs = jobs.filter((job) =>
    (selectedType === "All" || job.type === selectedType) &&
    (selectedLocation === "All" || job.location === selectedLocation) &&
    (selectedTitle === "All" || job.title === selectedTitle)
  );

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const handleLoadMore = () => {
    setVisibleJobs((prevVisibleJobs) => prevVisibleJobs + 8);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/admin/job/${jobId}`);
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <>
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
            {/* lọc danh sách địa điểm không trùng nhau */}
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

        {filteredJobs.length > 0 ? (
          <div className="jobList">
            {/* cắt ds công việc theo số lượng cần hiển thị */}
            {filteredJobs.slice(0, visibleJobs).map((job) => (
              <div key={job.id} className="jobCard animate-slide-up" onClick={() => handleViewDetails(job.id)}>
                <div className="jobHeader">
                  <span className="jobTitle">{truncateText(job.title, 15)}</span>
                  <span className={`jobType ${job.typeClass}`}>{job.type}</span>
                </div>
                <div className="jobBody">
                  <img src={job.logo} alt={job.company} className="jobLogo" />
                  <div>
                    <span className="companyName">{truncateText(job.company, 15)}</span>
                    <div className="jobLocation">📍 {truncateText(job.location, 15)}</div>
                  </div>
                </div>
                <div className="jobFooter">
                  <button
                    className="btn btn-success"
                    onClick={(e) => handleApproveJob(job.id, e)}
                  >
                    <i className="fas fa-check"></i> Duyệt
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={(e) => handleRejectJob(job.id, e)}
                  >
                    <i className="fas fa-times"></i> Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-jobs-message">
            <p>Không có công việc nào cần xác nhận</p>
          </div>
        )}

        {/* Nếu có nhiều hơn số jobs đang hiển thị thì nút loadMore mới xuất hiện */}
        {visibleJobs < filteredJobs.length && (
          <button className="loadMore" onClick={handleLoadMore}>
            Xem nhiều hơn
          </button>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ConfirmJobs;