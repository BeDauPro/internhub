import React, { useState } from 'react'
import fptLogo from '../../images/fpt.jpg'
import { PiCertificate } from "react-icons/pi";
import { FaLocationDot, FaMoneyBill1 } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import '../../styles/pages/student/jobdetail.scss';
import Navbar from '../../components/students/Navbar'
import Footer from '../../components/Footer'

const JobDetail = ({ job }) => {
    const [showAlert, setShowAlert] = useState(false);

    const handleApply = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3500); 
    };

    return (
        <>
        <Navbar/>
            {showAlert && (
                <div className="success-alert">
                    Đã nộp hồ sơ thành công vào {job.companyName}!
                </div>
            )}
            <div className="job-detail-container">
                <div className="job-header">
                    <div className="company-info">
                        <img className="company-logo" src={fptLogo} alt="Company Logo" />
                        <div className="company-details">
                            <h2>{job.companyName}</h2>
                            <p><FaLocationDot /> {job.location}</p>
                            <p className="job-field"><MdHomeRepairService /> Lĩnh vực: {job.field}</p>
                        </div>
                    </div>
                    <div className="job-summary">
                        <div className="job-summary-1">
                            <h3>{job.jobTitle}</h3>
                            <p><FaMoneyBill1 /> <strong>Mức lương:</strong> {job.salary}</p>
                            <p><PiCertificate /> <strong> Kinh nghiệm:</strong> {job.experience}</p>
                        </div>
                        <p className="job-type">{job.jobType}</p>
                    </div>
                </div>

                <div className="job-details">
                    <section>
                        <h3>Mô tả công việc</h3>
                        {job.jobDescription}
                    </section>
                    <section>
                        <h3>Yêu cầu công việc</h3>
                        {job.jobRequirements}
                    </section>
                    <section>
                        <h3>Ngôn ngữ</h3>
                        <p>{job.languages.join(', ')}</p>
                    </section>
                </div>

                <div className="job-footer">
                    <p><FaUsers /> Số lượng tuyển: {job.vacancies}</p>
                    <p><FaCalendarAlt /> Hạn nộp hồ sơ: {job.deadline}</p>
                    <button className="apply-btn" onClick={handleApply}>Apply</button>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default JobDetail
