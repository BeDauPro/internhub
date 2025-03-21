import React, { useState } from 'react'
import '../../styles/components/jobcard.scss'
import lgLogo from '../../images/lglogo.png'
import fptLogo from '../../images/fpt.jpg'
import nvLogo from '../../images/nvidialogo.png'
import { useNavigate } from 'react-router-dom'

export const jobs = [
  {
    id: 1,
    title: "Flutter",
    company: "FPT Software",
    location: "Đà Nẵng",
    type: "Part-time",
    typeClass: "partTime",
    logo: fptLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 2,
    title: "ReactJS",
    company: "LG Company",
    location: "Huế",
    type: "Part-time",
    typeClass: "partTime",
    logo: lgLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 3,
    title: "Full-stack",
    company: "NVIDIA Company",
    location: "Hà Nội",
    type: "Full-time",
    typeClass: "fullTime",
    logo: nvLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 4,
    title: "Flutter",
    company: "FPT Software",
    location: "Đà Nẵng",
    type: "Part-time",
    typeClass: "partTime",
    logo: fptLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 5,
    title: "ReactJS",
    company: "LG Company",
    location: "Huế",
    type: "Part-time",
    typeClass: "partTime",
    logo: lgLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 6,
    title: "Full-stack",
    company: "NVIDIA Company",
    location: "Hà Nội",
    type: "Full-time",
    typeClass: "fullTime",
    logo: nvLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 7,
    title: "Flutter",
    company: "FPT Software",
    location: "Đà Nẵng",
    type: "Part-time",
    typeClass: "partTime",
    logo: fptLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 8,
    title: "ReactJS",
    company: "LG Company",
    location: "Huế",
    type: "Part-time",
    typeClass: "partTime",
    logo: lgLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 9,
    title: "Full-stack",
    company: "NVIDIA Company",
    location: "Hà Nội",
    type: "Full-time",
    typeClass: "fullTime",
    logo: nvLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 10,
    title: "Flutter",
    company: "FPT Software",
    location: "Đà Nẵng",
    type: "Part-time",
    typeClass: "partTime",
    logo: fptLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 21,
    title: "ReactJS",
    company: "LG Company",
    location: "Huế",
    type: "Part-time",
    typeClass: "partTime",
    logo: lgLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 31,
    title: "Full-stack",
    company: "NVIDIA Company",
    location: "Hà Nội",
    type: "Full-time",
    typeClass: "fullTime",
    logo: nvLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 112,
    title: "Flutter",
    company: "FPT Software",
    location: "Đà Nẵng",
    type: "Part-time",
    typeClass: "partTime",
    logo: fptLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 32,
    title: "ReactJS",
    company: "LG Company",
    location: "Huế",
    type: "Part-time",
    typeClass: "partTime",
    logo: lgLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 3121,
    title: "Full-stack",
    company: "NVIDIA Company",
    location: "Hà Nội",
    type: "Full-time",
    typeClass: "fullTime",
    logo: nvLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 141,
    title: "Flutter",
    company: "FPT Software",
    location: "Đà Nẵng",
    type: "Part-time",
    typeClass: "partTime",
    logo: fptLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  {
    id: 243,
    title: "ReactJS",
    company: "LG Company",
    location: "Huế",
    type: "Part-time",
    typeClass: "partTime",
    logo: lgLogo,
    quantity: 10,
    date: "5/3/2025",
  },
  
];

const JobCard = ({ searchResults }) => {
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
    setVisibleJobs(prevVisibleJobs => prevVisibleJobs + 8);
  };

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
