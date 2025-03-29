import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/student/studentprofile.scss';
import { AiOutlineMail, AiOutlineHome, AiOutlinePhone, AiOutlineGithub, AiOutlineFileText } from "react-icons/ai";
import { FaGraduationCap, FaBirthdayCake, FaMale, FaLanguage } from "react-icons/fa";
import avatar from '../../images/avatar.jpg';
import Navbar from '../../components/students/Navbar'
import Footer from '../../components/Footer'
import Evaluate from './Evaluate';

const StudentProfile = ({ profileData, reviews }) => {
    const navigate = useNavigate();
    const handleEdit = () => {
        navigate('/profileform', { state: { profileData } });
    };

    if (!profileData) {
        return (
            <div className="error-container">
                <h2>Thông tin sinh viên không khả dụng</h2>
                <button onClick={() => window.location.reload()} className="back-btn">Tải lại</button>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="profile-container">
                <div className="profile-card">
                    <img className="profile-image" src={avatar} alt="Avatar" />
                    <h2>{profileData.name}</h2>
                    <p className="student-id">{profileData.studentId}</p>
                    <div className="status">
                        <span className="status-label">Trạng thái việc làm</span>
                        <span className="status-badge">{profileData.status}</span>
                    </div>
                    <section className="contact-section">
                        <h3>Thông tin liên hệ</h3>
                        <p><AiOutlineMail /> {profileData.email}</p>
                        <p><AiOutlineHome /> {profileData.address}</p>
                        <p><AiOutlinePhone /> {profileData.phone}</p>
                        <p><FaBirthdayCake /> {profileData.birthday}</p>
                        <p><FaMale /> {profileData.gender}</p>
                    </section>
                </div>
                <div className="profile-evaluate-container">
                    <div className="profile-details">
                        <section className="section">
                            <h3>Giới thiệu bản thân</h3>
                            <p>{profileData.introduction}</p>
                        </section>

                        <section className="section">
                            <h3>Trình độ học vấn</h3>
                            {profileData.education.map((edu, index) => (
                                <div key={index}>
                                    <p><strong>{edu.institution}</strong></p>
                                    <p>{edu.details}</p>
                                </div>
                            ))}
                        </section>

                        <section className="section">
                            <h3>Thông tin khác</h3>
                            <p><AiOutlineGithub /> <strong>Github link:</strong> <a href={profileData.otherInfo.github} target="_blank" rel="noopener noreferrer">{profileData.otherInfo.github}</a></p>
                            <p><FaGraduationCap /> <strong>GPA:</strong> {profileData.otherInfo.gpa}</p>
                            <p><FaLanguage /><strong>Ngôn ngữ sử dụng:</strong> {profileData.otherInfo.languages}</p>
                        </section>

                        <section className="section">
                            <h3>Kỹ năng chuyên môn</h3>
                            <ul>
                                {profileData.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="cv-section">
                            <h3>CV cá nhân:</h3>
                            <div className="cv-upload">
                                <AiOutlineFileText className="cv-icon" />
                                <span>{profileData.cvUploaded ? "Đã tải lên" : "Chưa tải lên"}</span>
                            </div>
                        </section>
                        <div className="profile-actions">
                            <button onClick={handleEdit} className="edit-btn">Chỉnh sửa</button>
                        </div>

                    </div>
                    <Evaluate initialReviews={reviews} />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default StudentProfile;
