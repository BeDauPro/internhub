import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/pages/employer/employerprofile.scss';
import defaultLogo from '../../images/fpt.jpg';
import {
  AiOutlineMail, AiOutlineHome, AiOutlinePhone,
  AiOutlineGroup, AiOutlineGlobal, AiOutlineFieldTime
} from "react-icons/ai";
import Review from '../employer/Review'; 
import Footer from '../../components/Footer';
import { getEmployerProfileById } from '../../services/employerApi';

const StudentViewEmployerProfile = () => {
  const { employerId } = useParams();
  const [employerProfile, setEmployerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        if (!employerId) {
          throw new Error('No employer ID provided');
        }
        
        setLoading(true);
        const data = await getEmployerProfileById(employerId);
        setEmployerProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading employer profile:', err);
        setError('Không thể tải thông tin nhà tuyển dụng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchEmployerProfile();
  }, [employerId]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!employerProfile) return <div className="not-found">Không tìm thấy thông tin nhà tuyển dụng</div>;

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <img 
            className="profile-image" 
            src={employerProfile.companyLogo || defaultLogo} 
            alt={`${employerProfile.companyName} logo`}
            onError={(e) => { e.target.src = defaultLogo; }}
          />
          <h2>{employerProfile.companyName}</h2>
          <p className="company-id">ID nhà tuyển dụng: {employerProfile.employerId}</p>
          <h3>Thông tin liên hệ</h3>
          <p><AiOutlineMail /> {employerProfile.companyEmail}</p>
          <p><AiOutlineHome /> {employerProfile.address}</p>
          <p><AiOutlinePhone /> {employerProfile.phone}</p>
          <p><AiOutlineGroup /> {employerProfile.employeeSize} nhân viên</p>
          {employerProfile.website && (
            <p><AiOutlineGlobal /> 
              <a href={employerProfile.website} target="_blank" rel="noopener noreferrer">
                {employerProfile.website}
              </a>
            </p>
          )}
          {employerProfile.foundedYear && (
            <p><AiOutlineFieldTime /> Thành lập: {employerProfile.foundedYear}</p>
          )}
        </div>

        <div className="main-profile">
          <div className="profile-details">
            <section className="section">
              <h3>Giới thiệu công ty</h3>
              <p>{employerProfile.companyDescription || 'Chưa có thông tin giới thiệu'}</p>
            </section>

            <section className="section">
              <h3>Ngành nghề</h3>
              <p><AiOutlineGroup /> {employerProfile.industry || 'Chưa cập nhật'}</p>
            </section>
          </div>
          <Review employerId={employerId} role="Student" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StudentViewEmployerProfile;
