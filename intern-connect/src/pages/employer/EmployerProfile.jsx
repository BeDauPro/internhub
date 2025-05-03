import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/pages/employer/employerprofile.scss';
import {
  AiOutlineMail, AiOutlineHome, AiOutlinePhone,
  AiOutlineGroup, AiOutlineGlobal, AiOutlineFieldTime
} from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import Review from './Review';
import Footer from '../../components/Footer';
import { getEmployerProfile, getEmployerProfileById } from '../../services/employerApi';
import defaultAvatar from '../../images/defaultAvatar.jpg';

const EmployerProfile = () => {
  const navigate = useNavigate();
  const { employerId } = useParams();
  const [employerProfile, setEmployerProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('role');
    setRole(userRole);

    const fetchData = async () => {
      try {
        let data;
        if (userRole === 'Employer') {
          data = await getEmployerProfile();
        } else if (userRole === 'Student') {
          data = await getEmployerProfileById(employerId);
        }

        if (!data) {
          setIsCreating(true);
        } else {
          setEmployerProfile(data);
        }
      } catch (err) {
        console.error('Error loading profile: ', err);
        alert('Không thể tải thông tin nhà tuyển dụng. Vui lòng thử lại sau.');
      }
    };

    if (userRole) fetchData();
  }, [employerId]);

  // Trường hợp chưa có thông tin và đang không tạo mới
  if (!employerProfile && !isCreating) {
    return (
      <div className="error-container">
        <h2>Chưa có thông tin hồ sơ công ty</h2>
        <button
          className="create-account-btn"
          onClick={() => navigate('/editprofile')}
        >
          Tạo mới hồ sơ công ty
        </button>
      </div>
    );
  }

  // Trạng thái loading
  if (!employerProfile) return <p>Đang tải...</p>;

  const handleEdit = () => {
    navigate('/editprofile', { state: { employerProfile } });
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <img className="profile-image" src={employerProfile.companyLogo || defaultAvatar} alt="Avatar" />
          <h2>{employerProfile.companyName}</h2>
          <p className="company-id">ID nhà tuyển dụng: {employerProfile.employerId}</p>
          <h3>Thông tin liên hệ</h3>
          <p><AiOutlineMail /> {employerProfile.companyEmail}</p>
          <p><AiOutlineHome /> {employerProfile.address}</p>
          <p><AiOutlinePhone /> {employerProfile.phone}</p>
          <p><FaUsers /> {employerProfile.employeeSize}</p>
          <p><AiOutlineGlobal /> 
            <a href={employerProfile.website} target="_blank" rel="noopener noreferrer">
              {employerProfile.website}
            </a>
          </p>
          <p><AiOutlineFieldTime /> {employerProfile.foundedYear}</p>
        </div>

        <div className="main-profile">
          <div className="profile-details">
            <section className="section">
              <h3>Giới thiệu công ty</h3>
              <p>{employerProfile.companyDescription || 'Chưa có mô tả'}</p>
            </section>

            <section className="section">
              <h3>Ngành nghề</h3>
              <p><AiOutlineGroup /> {employerProfile.industry || 'Chưa có ngành nghề'}</p>
            </section>

            {role === 'Employer' && (
              <div className="profile-actions">
                <button className="edit-btn" onClick={handleEdit}>Chỉnh sửa</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmployerProfile;
