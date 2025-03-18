import React, { useState, useEffect } from "react";
import "../../styles/pages/student/profileform.scss";
import { useNavigate } from "react-router-dom";
import avatar from "../../images/avatar.jpg";
import { AiOutlineMail, AiOutlineHome, AiOutlinePhone, AiOutlineGithub, AiOutlineFileText } from "react-icons/ai";
import { FaGraduationCap, FaBirthdayCake, FaMale } from "react-icons/fa";

const ProfileForm = ({ initialData, onSave }) => {
  const navigate = useNavigate();

  //formData nhận dữ liệu từ initialData được truyền từ app.js
  const [formData, setFormData] = useState(initialData);
  //đảm bảo formData được cập nhật khi initialData thay đổi
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]); 

  //xử lý thay đổi input với handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //xử lý thay đổi input với handleArrayChange
  const handleArrayChange = (e, field) => {
    const value = e.target.value.split(",").map((item) => item.trim());
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    console.log("Updated Data:", formData);
    onSave(formData);//gọi hàm để cập nhật dữ liệu về app.js
    navigate("/studentprofile");
  };

  return (
    <div className="profile-edit-container">
      <div className="profile-edit-card">
        <img className="profile-edit-image" src={avatar} alt="Avatar" />
        <h2>{formData.name}</h2>
        <p className="student-id">{formData.studentId}</p>
        <div className="status">
          <span className="status-label">Trạng thái việc làm</span>
          <span className="status-badge">{formData.status}</span>
        </div>
      </div>

      <div className="profile-edit-details">
        <section>
          <h3>Thông tin liên hệ</h3>
          <p><AiOutlineMail /> <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" /></p>
          <p><AiOutlineHome /> <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ" /></p>
          <p><AiOutlinePhone /> <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" /></p>
          <p><FaBirthdayCake /> <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} /></p>
          <p><FaMale /> <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Giới tính" /></p>
        </section>

        <section>
          <h3>Giới thiệu bản thân</h3>
          <textarea name="introduction" value={formData.introduction} onChange={handleChange} />
        </section>

        <section>
          <h3>Trình độ học vấn</h3>
          <input 
            type="text" 
            name="education" 
            value={formData.education.map((edu) => edu.institution).join(", ")} 
            onChange={(e) => handleArrayChange(e, "education")} 
            placeholder="Nhập các trường học, cách nhau bằng dấu phẩy"
          />
          <input type="text" name="gpa" value={formData.otherInfo.gpa} onChange={handleChange} placeholder="GPA" />
        </section>

        <section>
          <h3>Github</h3>
          <input type="url" name="github" value={formData.otherInfo.github} onChange={handleChange} />
        </section>

        <section>
          <h3>Kỹ năng</h3>
          <textarea 
            name="skills" 
            value={formData.skills.join(", ")} 
            onChange={(e) => handleArrayChange(e, "skills")} 
            placeholder="Nhập các kỹ năng, cách nhau bằng dấu phẩy"
          />
        </section>

        <div className="profile-edit-actions">
          <button onClick={handleSave} className="save-btn">Lưu</button>
          <button onClick={() => navigate("/studentprofile")} className="cancel-btn">Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
