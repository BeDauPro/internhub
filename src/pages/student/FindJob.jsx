import React, { useEffect } from 'react'
import Navbar from '../../components/students/Navbar'
import Footer from '../../components/Footer'
import JobCard from './JobCard'
import '../../styles/pages/student/findjob.scss'
import '../../styles/pages/student/overview.scss'
import FptIntern from '../../images/fptintern.jpg'
import Intern from '../../images/intern.jpg'
import imgLogin from '../../images/login.jpg'

const HeroSection = () => {
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
                    <input type="text" placeholder="Vị trí tuyển dụng/tên công ty" />
                </div>

                <div className="location-input">
                    <i className="fa fa-globe location-icon"></i>
                    <span>Địa điểm</span>
                    <i className="fa fa-chevron-down dropdown-icon"></i>
                </div>

                <button className="submit-button">Tìm kiếm</button>
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
    return (
        <div className="find-job">
            <Navbar />
            <HeroSection />
            <Overview />
            <JobCard/>
            <Footer />
        </div>
    );
};

export default FindJob;

