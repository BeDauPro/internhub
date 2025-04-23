import React, { useState, useEffect } from 'react';
import '../../styles/components/jobcard.scss';
import { useNavigate } from 'react-router-dom';
import { getAllJobs, getFilteredJobs } from '../../services/JobPostingApi';

const JobCard = ({ searchResults }) => {
  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(8);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTitle, setSelectedTitle] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        let jobsData;

        if (searchResults && (searchResults.searchInput || searchResults.selectedLocation)) {
          jobsData = await getFilteredJobs(
            searchResults.searchInput || '',
            selectedType !== 'All' ? selectedType : '',
            searchResults.selectedLocation || '',
            selectedCategory !== 'All' ? selectedCategory : '',
            'desc',
            1,
            50
          );
          if (jobsData.items) jobsData = jobsData.items;
        } else {
          // Gọi API với tham số mặc định để tránh lỗi 400
          jobsData = await getAllJobs(
            selectedCategory !== 'All' ? selectedCategory : '',
            selectedLocation !== 'All' ? selectedLocation : '',
            selectedType !== 'All' ? selectedType : ''
          );
        }

        const transformedJobs = jobsData.map(job => ({
          id: job.jobPostingId || job.id,
          title: job.jobTitle || 'Chưa có tiêu đề',
          type: job.workType || 'Chưa có loại hình',
          typeClass: job.workType === 'Full-time' ? 'fullTime' : 'partTime', 
          logo: job.companyLogo || '/default-logo.png',
          company: job.companyName || 'Chưa có tên công ty',
          location: job.location || 'Chưa có địa điểm',
          quantity: job.vacancies || 0,
          date: job.postedAt || 'Chưa có ngày tạo', 
        }));

        setJobs(transformedJobs);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Không thể tải danh sách công việc. Vui lòng thử lại sau.");
        // Nếu lỗi, có thể sử dụng mock data để hiển thị giao diện
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [selectedType, selectedLocation, selectedCategory, searchResults]);

  // Hàm hỗ trợ để format location
  const formatLocation = (location) => {
    if (!location) return 'Không xác định';
    const parts = location.split(',');
    return parts[0].trim();
  };

  // Hàm lấy tên công ty từ category
  const getCompanyFromCategory = (category) => {
    if (!category) return 'Công ty';
    // Bạn có thể thêm logic để map category sang company name ở đây
    return category;
  };

  const filteredJobs = jobs.filter(job =>
    (selectedType === "All" || job.type === selectedType) &&
    (selectedLocation === "All" || job.location === selectedLocation) &&
    (selectedCategory === "All" || job.category === selectedCategory)
  );

  const handleLoadMore = () => {
    setVisibleJobs(prev => prev + 8);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobdetail/${jobId}`);
  };

  if (isLoading) return <div className="loading-container">Đang tải...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="JobListContainer job-list-background" style={{ marginBottom: '1vh' }}>
      <h2>Các công việc HOT</h2>

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
          <div
            key={job.id}
            className="jobCard animate-slide-up"
            onClick={() => handleViewDetails(job.id)}
          >
            <div className="jobHeader">
              <span className="jobTitle">{job.title}</span>
              <span className={`jobType ${job.typeClass}`}>{job.type}</span>
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
              <span>Ngày tạo: {new Date(job.date).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        ))}
      </div>

      {visibleJobs < filteredJobs.length && (
        <button className="loadMore" onClick={handleLoadMore}>Xem nhiều hơn</button>
      )}
    </div>
  );
};

export default JobCard;