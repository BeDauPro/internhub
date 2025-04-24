import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PiCertificate } from "react-icons/pi";
import { FaLocationDot, FaMoneyBill1 } from "react-icons/fa6";
import { MdHomeRepairService } from "react-icons/md";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import '../../styles/pages/student/jobdetail.scss';
import Footer from '../../components/Footer';
import { getJobById } from '../../services/JobPostingApi';
import {applyForJob} from '../../services/ApplicationApi';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const data = await getJobById(id);
                console.log(data);
                setJob(data);
            } catch (error) {
                console.error("Failed to fetch job details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    const handleApply = async () => {
        const studentId = localStorage.getItem('token');
        if (!studentId) {
            alert("Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.");
            return;
        }
    
        const applicationData = {
            jobPostingId: id, // ID của công việc
            // studentId: studentId, // ID của sinh viên
            // applicationDate: new Date().toISOString(), // Ngày nộp hồ sơ
        };
    
        console.log("Application Data:", applicationData); // Log dữ liệu để kiểm tra
    
        try {
            const response = await applyForJob(applicationData);
            console.log("Response:", response); // Log phản hồi từ API
            if (response.status === "success") {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3500);
            } else {
                setResponse(response);
                alert(response.message);
            }
        } catch (error) {
            console.error("Error applying for job:", error);
            alert(error.data?.message || "Đã xảy ra lỗi khi nộp hồ sơ. Vui lòng thử lại sau.");
        }
    };

    if (loading) {
        return <div>Loading job details...</div>;
    }

    if (!job) {
        return <div>Không tìm thấy thông tin công việc.</div>;
    }

    return (
        <>
            <div className="job-detail-page">
                {showAlert && (
                    <div className="success-alert">
                        Đã nộp hồ sơ thành công vào {job.companyName}!
                    </div>
                )}
                <div className="job-detail-container">
                    <div className="job-header">
                        <div className="company-info">
                            <img
                                className="company-logo"
                                src={job.companyLogo}
                                alt="Company Logo"
                            />
                            <div
                                className="company-details"
                                onClick={() => navigate(`/viewemployer/${job.employerId}`)}
                                style={{ cursor: "pointer" }}
                            >
                                <h2>{job.companyName}</h2>
                                <p><FaLocationDot /> {job.location}</p>
                                <p className="job-field"><MdHomeRepairService /> Lĩnh vực: {job.industry}</p>
                            </div>
                        </div>
                        <div className="job-summary">
                            <div className="job-summary-1">
                                <h3>{job.jobTitle}</h3>
                                <p><FaMoneyBill1 /> <strong>Mức lương:</strong> {job.salary}</p>
                                <p><PiCertificate /> <strong> Kinh nghiệm:</strong> {job.experienceRequired}</p>
                            </div>
                            <p className="job-type">{job.workType}</p>
                        </div>
                    </div>

                    <div className="job-details">
                        <section>
                            <h3>Mô tả công việc</h3>
                            <p>{job.jobDesc || 'Không có mô tả công việc'}</p>
                        </section>
                        <section>
                            <h3>Yêu cầu công việc</h3>
                            <p>{job.skillsRequired || 'Không có yêu cầu công việc'}</p>
                        </section>
                        <section>
                            <h3>Ngôn ngữ</h3>
                            <p>{job.languagesRequired || 'Không có thông tin ngôn ngữ'}</p>
                        </section>
                        <section>
                            <h3>Loại công việc</h3>
                            <p>{job.jobCategory || 'Không có thông tin loại công việc'}</p>
                        </section>
                        <section>
                            <h3>Hạn nộp hồ sơ</h3>
                            <p>{job.applicationDeadline || 'Không có thông tin hạn nộp'}</p>
                        </section>
                    </div>

                    <div className="job-footer">
                        <p><FaUsers /> Số lượng tuyển: {job.vacancies}</p>
                        <p><FaCalendarAlt /> Hạn nộp hồ sơ: {new Date(job.applicationDeadline).toLocaleDateString()}</p>
                        <button className="apply-btn" onClick={handleApply}>Apply</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default JobDetail;
