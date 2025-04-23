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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);

        let jobsData;

        // Nếu có kết quả tìm kiếm
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

          // Xử lý dữ liệu phân trang nếu API trả về
          if (jobsData && jobsData.items) {
            jobsData = jobsData.items;
          }
        } else {
          // Gọi API với tham số mặc định để tránh lỗi 400
          jobsData = await getAllJobs(
            selectedCategory !== 'All' ? selectedCategory : '',
            selectedLocation !== 'All' ? selectedLocation : '',
            selectedType !== 'All' ? selectedType : ''
          );
        }

        // Chuyển đổi dữ liệu từ API sang format phù hợp với UI
        const transformedJobs = Array.isArray(jobsData) ? jobsData.map(job => ({
          id: job.jobPostingId || job.id,
          title: job.jobTitle,
          type: job.workType || 'Full-time',
          typeClass: (job.workType === 'Full-time' || job.workType === 'Toàn thời gian') ? 'fullTime' : 'partTime',
          logo: job.companyLogo || '/default-logo.png',
          company: job.companyName || getCompanyFromCategory(job.jobCategory),
          location: formatLocation(job.location),
          quantity: job.vacancies || 1,
          salary: job.salary,
          category: job.jobCategory
        })) : [];

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

  const filteredJobs = jobs.filter((job) =>
    (selectedType === "All" || job.type === selectedType) &&
    (selectedLocation === "All" || job.location === selectedLocation) &&
    (selectedCategory === "All" || job.category === selectedCategory)
  );

  const handleLoadMore = () => {
    setVisibleJobs(prevVisibleJobs => prevVisibleJobs + 8);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobdetail/${jobId}`);
  };

  if (isLoading) return <div className="loading-container">Đang tải...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <>
      <div className="JobListContainer" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#003366', fontSize: '1.8rem' }}>
          Danh sách công việc
        </h2>

        <div className="filters" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="All">Tất cả loại hình</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="All">Tất cả địa điểm</option>
            {[...new Set(jobs.map(job => job.location))].filter(Boolean).map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="All">Tất cả ngành nghề</option>
            {[...new Set(jobs.map(job => job.category))].filter(Boolean).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="jobList" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {filteredJobs.length > 0 ? (
            filteredJobs.slice(0, visibleJobs).map((job) => (
              <div key={job.id} className="jobCard" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="jobHeader" style={{
                  padding: '15px 15px 5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span className="jobTitle" style={{
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>{job.title}</span>
                  <span className={`jobType ${job.typeClass}`} style={{
                    padding: '4px 10px',
                    borderRadius: '15px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: job.typeClass === 'fullTime' ? '#4CAF50' : '#1a56db',
                  }}>
                    {job.type}
                  </span>
                </div>

                <div className="jobBody" style={{
                  padding: '10px 15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <img src={job.logo} alt={job.company} className="jobLogo" style={{
                    width: '50px',
                    height: '50px',
                    marginRight: '10px',
                    objectFit: 'contain'
                  }} />
                  <div>
                    <span className="companyName" style={{
                      display: 'block',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>{job.company}</span>
                    <div className="jobLocation" style={{
                      fontSize: '0.8rem',
                      color: '#666'
                    }}>
                      <span style={{ color: '#e74c3c', marginRight: '3px' }}>📍</span> {job.location}
                    </div>
                    <div className="jobSalary" style={{
                      fontSize: '0.8rem',
                      color: '#28a745',
                      marginTop: '2px'
                    }}>
                      💰 {job.salary || 'Thương lượng'}
                    </div>
                  </div>
                </div>

                <div className="jobFooter" style={{
                  padding: '10px 15px 15px',
                  marginTop: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #eee'
                }}>
                  <span style={{ fontSize: '0.75rem' }}>Số lượng tuyển: {job.quantity}</span>
                  <button
                    onClick={() => handleViewDetails(job.id)}
                    className="viewDetails"
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
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
              <p>Không có công việc nào phù hợp với tiêu chí tìm kiếm.</p>
            </div>
          )}
        </div>

        {visibleJobs < filteredJobs.length && (
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              className="loadMore"
              onClick={handleLoadMore}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #0078d7',
                color: '#0078d7',
                borderRadius: '5px',
                padding: '8px 20px',
                cursor: 'pointer',
                fontWeight: 'normal',
                transition: 'all 0.2s'
              }}
            >
              Xem nhiều hơn
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default JobCard;