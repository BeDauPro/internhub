import React, { useState, useEffect } from 'react'
import '../../styles/components/jobcard.scss'
import { useNavigate } from 'react-router-dom'
import { getAllJobs } from '../../services/JobPostingApi' // Điều chỉnh path import

const JobCard = ({ searchResults }) => {
  const [jobs, setJobs] = useState([]);
  const [visibleJobs, setVisibleJobs] = useState(8);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedTitle, setSelectedTitle] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch jobs when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await getAllJobs();
        
        // Transform jobs to match the original component's structure
        const transformedJobs = fetchedJobs.map(job => ({
          id: job.jobPostingId,
          title: job.jobTitle,
          type: job.workType,
          typeClass: job.workType === 'Full-time' ? 'fullTime' : 'partTime',
          logo: job.companyLogo || '/default-logo.png',
          company: job.companyName,
          location: job.location,
          quantity: job.vacancies,
          date: new Date(job.postedAt).toLocaleDateString()
        }));

        setJobs(transformedJobs);
        setIsLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách công việc");
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    (selectedType === "All" || job.type === selectedType) &&
    (selectedLocation === "All" || job.location === selectedLocation) &&
    (selectedTitle === "All" || job.title === selectedTitle) &&
    (!searchResults || 
      (!searchResults.searchInput || job.title.toLowerCase().includes(searchResults.searchInput.toLowerCase())) &&
      (!searchResults.selectedLocation || job.location === searchResults.selectedLocation))
  );

  const handleLoadMore = () => {
    setVisibleJobs(prevVisibleJobs => prevVisibleJobs + 8);
  };

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="JobListContainer job-list-background" style={{ marginBottom: '1vh' }}>
        <h2>Các công việc HOT</h2>
        <div className="filters">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="All">Tất cả loại hình</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
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
        <div className="jobList" onClick={() => navigate("/jobdetail")}>
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
                <span>Ngày tạo: {job.date}</span>
              </div>
            </div>
          ))}
        </div>
        {visibleJobs < filteredJobs.length && (
          <button className="loadMore" onClick={handleLoadMore}>Xem nhiều hơn</button>
        )}
      </div>
    </>
  );
};

export default JobCard;