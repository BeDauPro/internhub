import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/employer/employerprofile.scss';
import logo from '../../images/fpt.jpg';
import { AiOutlineMail, AiOutlineHome, AiOutlinePhone, AiOutlineGroup, AiOutlineGlobal, AiOutlineFieldTime } from "react-icons/ai";
import Review from './Review';
import Footer from '../../components/Footer';
import { getEmployerProfile, createEmployer } from '../../services/employerApi';
const EmployerProfile = () => {
    const navigate = useNavigate();
    const [employerProfile, setEmployerProfile] = React.useState(null);
    const [EmployerReview, setEmployerReview] = React.useState(null);
    const [isCreating, setIsCreating] = React.useState(false);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const data = await getEmployerProfile();
                if (!data) {
                    setIsCreating(true); 
                } else {
                    setEmployerProfile(data);
                    setEmployerReview(data.EmployerReview);
                }
            } catch (err) {
                console.error('Error loading profile: ', err);
                alert('Không thể tải thông tin nhà tuyển dụng. Vui lòng thử lại sau.');
            }
        };
        fetchData();
    },[]);

    const handleCreate = async (formData) => {
        try{
            const newEmployer = await createEmployer(formData);
            setEmployerProfile(newEmployer);
            setIsCreating(false);
        } catch(err){
            console.error('Error creating profile: ', err);
            alert('Không thể tạo thông tin nhà tuyển dụng. Vui lòng thử lại sau.');
        }
    };

    if (!employerProfile && !isCreating) {
        return (
            <div className="error-container">

                <h2>Thông tin công ty không khả dụng</h2>
                <button
                    onClick={() => navigate('/editprofile')}
                    className="create-account-btn">
                    Tạo tài khoản
                </button>
            </div>
        );
    }

    const handleEdit = () => {
        navigate('/editprofile', { state: { employerProfile } });
    };

    return (
        <>
            <div className="profile-container">
                <div className="profile-card">
                    <img className="profile-image" src={employerProfile.companyLogo || logo} alt="Avatar" />
                    <h2>{employerProfile.companyName}</h2>
                    <p className="company-id">ID nhà tuyển dụng: {employerProfile.employerId}</p>
                    <h3>Thông tin liên hệ</h3>
                    <p><AiOutlineMail /> {employerProfile.companyEmail}</p>
                    <p><AiOutlineHome /> {employerProfile.address}</p>
                    <p><AiOutlinePhone /> {employerProfile.phone}</p>
                    <p><AiOutlineGroup /> {employerProfile.employeeSize}</p>
                    <p><AiOutlineGlobal /> <a href={employerProfile.website} target="_blank" rel="noopener noreferrer">{employerProfile.website}</a></p>
                    <p><AiOutlineFieldTime /> {employerProfile.foundedYear}</p>
                </div>
                <div className='main-profile'>
                    <div className="profile-details">
                        <section className="section">
                            <h3>Giới thiệu công ty</h3>
                            <p>{employerProfile.companyDescription}</p>
                        </section>

                        <section className="section">
                            <h3>Ngành nghề</h3>
                            <p><AiOutlineGroup /> {employerProfile.industry}</p>
                        </section>
                        <div className='profile-actions'>
                            <button className="edit-btn" onClick={handleEdit}>Chỉnh sửa</button>
                        </div>
                    </div>
                    <Review EmployerReview={EmployerReview}/>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EmployerProfile;
