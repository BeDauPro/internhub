import React, { useEffect, useState } from 'react'
import Navbar from '../../components/students/Navbar'
import Footer from '../../components/Footer'
import JobCard from './JobCard'
import '../../styles/pages/student/findjob.scss'
import '../../styles/pages/student/overview.scss'
import FptIntern from '../../images/fptintern.jpg'
import Intern from '../../images/intern.jpg'
import imgLogin from '../../images/login.jpg'
import { jobs } from './JobCard';

const HeroSection = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');

    const handleSearch = () => {
        onSearch(searchInput, selectedLocation);
    };

    useEffect(() => {
        const handleScroll = () => {
            const bgText = document.querySelector('.bg-text');
            const searchBar = document.querySelector('.search-bar');
            const img4 = document.querySelector('.img4');

            if (window.scrollY >= img4.offsetTop) {
                bgText.style.position = 'absolute';
                bgText.style.top = `${img4.offsetTop}px`;
                searchBar.style.position = 'absolute';
                searchBar.style.top = `${img4.offsetTop + bgText.offsetHeight}px`;
            } else {
                bgText.style.position = 'fixed';
                bgText.style.top = '50%';
                searchBar.style.position = 'fixed';
                searchBar.style.top = 'calc(50% + 10px)';
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const uniqueLocations = [...new Set(jobs.map(job => job.location))]; 

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
                        {uniqueLocations.map(location => (
                            <li key={location}>
                                <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={() => setSelectedLocation(location)}
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
    const [searchResults, setSearchResults] = useState(null);
    const jobCardRef = React.useRef(null);

    const handleSearch = (searchInput, selectedLocation) => {
        const result = searchInput ? { searchInput } : { selectedLocation };
        setSearchResults(result);
        if (jobCardRef.current) {
            jobCardRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="find-job">
            <Navbar />
            <HeroSection onSearch={handleSearch} />
            <Overview />
            <div ref={jobCardRef}>
                <JobCard searchResults={searchResults} />
            </div>
            <Footer />
        </div>
    );
};

export default FindJob;

