import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/employer/employerprofile.scss';
import logo from '../../images/fpt.jpg';
import { AiOutlineMail, AiOutlineHome, AiOutlinePhone, AiOutlineGroup, AiOutlineGlobal, AiOutlineFieldTime } from "react-icons/ai";
import Review from './Review';

const EmployerProfile = ({ profileData }) => {
    const navigate = useNavigate();
    const handleEdit = () => {
        navigate('/editprofile', { state: { profileData } });
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <img className="profile-image" src={logo} alt="Avatar" />
                <h2>{profileData.companyName}</h2>
                <p className="company-id">{profileData.companyID}</p>
                <h3>Thông tin liên hệ</h3>
                <p><AiOutlineMail /> {profileData.companyEmail}</p>
                <p><AiOutlineHome /> {profileData.addresscom}</p>
                <p><AiOutlinePhone /> {profileData.phone}</p>
                <p><AiOutlineGroup/>{profileData.totalEmployee}</p>
                <p><AiOutlineGlobal/> <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a></p>
                <p><AiOutlineFieldTime/>  {profileData.since}</p>
            </div>
            <div className='main-profile'>
            <div className="profile-details">
                <section className="section">
                    <h3>Giới thiệu công ty</h3>
                    <p>{profileData.introduction}</p>
                </section>

                <section className="section">
                    <h3>Dịch vụ cung cấp</h3>
                    <ul>
                        {profileData.services?.map((service, index) => (
                            <li key={index}>{service}</li>
                        ))}
                    </ul>
                </section>
                <div className='profile-actions'>
                    <button className="edit-btn" onClick={handleEdit}>Chỉnh sửa</button>
                </div>       
            </div>
            <Review/>
            </div>
        </div>
    );
};

export default EmployerProfile;
