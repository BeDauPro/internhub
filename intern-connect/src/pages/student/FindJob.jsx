import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import JobCard from './JobCard';
import '../../styles/pages/student/findjob.scss';
import '../../styles/pages/student/overview.scss';
import FptIntern from '../../images/fptintern.jpg';
import Intern from '../../images/intern.jpg';
import imgLogin from '../../images/login.jpg';
import { getAllJobs, getFilteredJobs } from '../../services/JobPostingApi';

const HeroSection = ({ onSearch, jobs }) => {
    const [searchInput, setSearchInput] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    const handleSearch = () => {
        onSearch(searchInput, selectedLocation);
    };

    // Hỗ trợ phím Enter trong ô tìm kiếm
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const bgText = document.querySelector('.bg-text');
            const searchBar = document.querySelector('.search-bar');
            const img4 = document.querySelector('.img4');

            if (bgText && searchBar && img4 && window.scrollY >= img4.offsetTop) {
                bgText.style.position = 'absolute';
                bgText.style.top = `${img4.offsetTop}px`;
                searchBar.style.position = 'absolute';
                searchBar.style.top = `${img4.offsetTop + bgText.offsetHeight}px`;
            } else if (bgText && searchBar) {
                bgText.style.position = 'fixed';
                bgText.style.top = '50%';
                searchBar.style.position = 'fixed';
                searchBar.style.top = 'calc(50% + 10px)';
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const uniqueLocations = jobs && jobs.length > 0 ? [...new Set(jobs.map(job => job.location))] : [];

    return (
        <section className="hero-section" style={{ marginBottom: '10vh' }}>
            <div className="bg-image img1">
                <div className="overlay"></div>
            </div>
            <div className="bg-image img2">
                <div className="overlay"></div>
            </div>
            <div className="bg-image img3">
                <div className="overlay"></div>
            </div>
            <div className="bg-image img4">
                <div className="overlay"></div>
            </div>

            <div className="bg-text">
                Khám phá <span className="text-yellow-500">CƠ HỘI THỰC TẬP</span> <br />Bước đệm cho sự nghiệp tương lai!
            </div>
            <div className="search-bar">
                <div className="search-input">
                    <i className="fa fa-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="Vị trí tuyển dụng/tên công ty"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                </div>

                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle location-input"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="fa fa-globe location-icon"></i>
                        {selectedLocation || 'Địa điểm'}
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <a
                                className="dropdown-item"
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedLocation('');
                                }}
                            >
                                Tất cả địa điểm
                            </a>
                        </li>
                        {uniqueLocations.map(location => (
                            <li key={location}>
                                <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedLocation(location);
                                    }}
                                >
                                    {location}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <button className="submit-button" onClick={handleSearch}>
                    Tìm kiếm
                </button>
            </div>
        </section>
    );
};

const Overview = () => {
    return (
        <section className="overview-container container" style={{ marginBottom: '10vh' }}>
            <div className="row">
                <div className="col-lg-6 text-content">
                    <h5 className="subtitle">TỔNG QUAN WEBSITE</h5>
                    <h2 className="title">
                        CẦU NỐI VỮNG CHẮC <br /> GIỮA SINH VIÊN VÀ DOANH NGHIỆP
                    </h2>
                    <p className="description">
                        Hệ thống giúp sinh viên dễ dàng tìm kiếm cơ hội thực tập phù hợp, xây dựng hồ sơ chuyên nghiệp và nhận phản hồi từ nhà tuyển dụng.
                        Với tính năng lọc thông minh theo địa điểm và công nghệ, hệ thống tối ưu hóa trải nghiệm, tiết kiệm thời gian và nâng cao cơ hội kết nối giữa sinh viên và doanh nghiệp.
                    </p>

                    <div className="stats row">
                        <div className="col-md-6 stat-box">
                            <i className="fa fa-users icon"></i>
                            <div>
                                <h4>1000+ SINH VIÊN</h4>
                                <p>Chưa có việc làm</p>
                            </div>
                        </div>
                        <div className="col-md-6 stat-box">
                            <i className="fa fa-building icon"></i>
                            <div>
                                <h4>100+ DOANH NGHIỆP</h4>
                                <p>Thiếu nhân sự chất lượng cao</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 image-content">
                    <div className="main-image text-center">
                        <img src={FptIntern} alt="Main" className="img-fluid rounded" />
                    </div>
                    <div className="sub-images d-flex justify-content-center mt-3">
                        <img src={Intern} alt="Sub 1" className="img-fluid rounded me-2" />
                        <img src={imgLogin} alt="Sub 2" className="img-fluid rounded" />
                    </div>
                </div>
            </div>
        </section>
    );
};

const FindJob = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchInfo, setSearchInfo] = useState({
        searchTerm: '',
        location: ''
    });
    const jobCardRef = React.useRef(null);

    useEffect(() => {
        const fetchInitialJobs = async () => {
            try {
                setIsLoading(true);
                // Lấy danh sách công việc ban đầu
                const jobsData = await getAllJobs('', '', '');

                if (Array.isArray(jobsData)) {
                    setJobs(jobsData);
                    setFilteredJobs(jobsData);
                    setError(null);
                } else {
                    setError("Không thể tải danh sách công việc");
                    setJobs([]);
                    setFilteredJobs([]);
                }
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Không thể tải danh sách công việc");
                setJobs([]);
                setFilteredJobs([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialJobs();
    }, []);

    const handleSearch = async (searchInput, selectedLocation) => {
        try {
            setIsLoading(true);
            setSearchInfo({
                searchTerm: searchInput,
                location: selectedLocation
            });

            // Gọi API tìm kiếm với các tham số
            const result = await getFilteredJobs(
                searchInput,      // searchTerm - tên công ty hoặc tiêu đề công việc
                '',               // workType - để trống
                selectedLocation, // location - địa điểm
                '',               // jobCategory - để trống
                'desc',           // sortDirection - sắp xếp giảm dần
                1,                // pageNumber - trang đầu tiên
                100               // pageSize - kích thước lớn để không cần phân trang
            );

            if (result && Array.isArray(result.items)) {
                setFilteredJobs(result.items);
            } else if (result && Array.isArray(result)) {
                // Xử lý trường hợp API trả về mảng trực tiếp
                setFilteredJobs(result);
            } else {
                setFilteredJobs([]);
                setError("Không tìm thấy kết quả phù hợp");
            }

            // Cuộn đến kết quả tìm kiếm
            if (jobCardRef.current) {
                jobCardRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (err) {
            console.error("Error searching jobs:", err);
            setError("Có lỗi xảy ra khi tìm kiếm công việc");
            setFilteredJobs([]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && jobs.length === 0) {
        return (
            <div className="find-job">
                <HeroSection onSearch={handleSearch} jobs={[]} />
                <Overview />
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="find-job">
            <HeroSection onSearch={handleSearch} jobs={jobs} />
            <Overview />

            {isLoading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            )}

            {error && !isLoading && (
                <div className="alert alert-danger text-center" role="alert" style={{ margin: '20px auto', maxWidth: '600px' }}>
                    {error}
                </div>
            )}

            <div ref={jobCardRef}>
                <JobCard
                    jobs={filteredJobs}
                    searchInfo={searchInfo}
                />
            </div>
            <Footer />
        </div>
    );
};

export default FindJob;