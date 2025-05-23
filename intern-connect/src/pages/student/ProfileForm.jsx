import React, { useState, useEffect } from "react";
import "../../styles/pages/student/profileform.scss";
import { useNavigate } from "react-router-dom";
import avatar from "../../images/avatar.jpg";
import {
  AiOutlineMail,
  AiOutlineHome,
  AiOutlinePhone,
  AiOutlineGithub,
} from "react-icons/ai";
import { FaGraduationCap, FaBirthdayCake, FaMale } from "react-icons/fa";
import Footer from "../../components/Footer";
import {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateAvatar,
  createAvatar,
} from "../../services/studentApi";

const ProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  //lấy thông tin sinh viên từ API
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getStudentProfile();
        console.log("Fetched student data:", data);
        setFormData(data || {});
      } catch (error) {
        if (error.response?.status === 401) {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else {
          console.error("Lỗi khi tải dữ liệu sinh viên:", error);
          alert("Không thể tải dữ liệu sinh viên");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, cvFile: file });
  };

  const handleAvatarChange = async (e) => {
    
    const file = e.target.files[0];
  
    if (!file) return;

    try {
      //gọi hàm từ Api để cập nhật ảnh đại diện theo id và file
      const response = await createAvatar(file);
      if (response?.url) {
        localStorage.setItem("ProfileUpdateImage", response.url);
        console.log("New image URL:", response.url);
        // cập nhật lại formData với ảnh đại diện mới
        setFormData((prev) => ({  
          ...prev,
          ProfilePicture: response.url,
        }));
        alert("Ảnh đại diện đã được cập nhật!");
      } else {
        alert("Không thể cập nhật ảnh đại diện.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật ảnh đại diện.");
    }
  };

  const handleCreate = async () => {
    const profilePicture = localStorage.getItem("ProfileUpdateImage");
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "cvFile" && formData.cvFile) {
        formDataToSend.append(key, formData.cvFile);
      } else {
        formDataToSend.append(key, formData[key] || "");
      }
    });
    profilePicture ? formDataToSend.append("ProfilePicture2", profilePicture) : console.log("No new profile picture");
    try {
      await createStudent(formDataToSend);
      alert("Tạo sinh viên thành công!");
      navigate("/studentprofile");
    } catch (error) {
      console.error("Lỗi khi tạo sinh viên:", error);
      alert("Đã xảy ra lỗi khi tạo sinh viên");
    }
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    const profilePicture = localStorage.getItem("ProfileUpdateImage");
    Object.keys(formData).forEach((key) => {
      console.log("Appending key:", key, "Value:", formData[key]);
      if (key === "cvFile" && formData.cvFile) {
        formDataToSend.append(key, formData.cvFile);
      } else {
        formDataToSend.append(key, formData[key] || "");
      }
      
    });

    profilePicture ? formDataToSend.append("ProfilePicture2", profilePicture) : console.log("No new profile picture");
    
    try {
      await updateStudent(formData.id, formDataToSend);
      alert("Cập nhật sinh viên thành công!");
      navigate("/studentprofile");
    } catch (error) {
      console.error("Lỗi khi cập nhật sinh viên:", error);
      alert("Đã xảy ra lỗi khi cập nhật sinh viên");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xoá sinh viên này?")) return;
    try {
      await deleteStudent(formData.id);
      alert("Xoá sinh viên thành công!");
      navigate("/studentprofile");
    } catch (error) {
      console.error("Lỗi khi xoá sinh viên:", error);
      alert("Đã xảy ra lỗi khi xoá sinh viên");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <div className="profile-edit-container">
        <div className="profile-edit-wrapper">
          <div className="profile-edit-card">
              <img className="profile-edit-image"  src={formData.profilePicture} alt="Preview" />
            <section className="logo-upload">
              <h3>Ảnh đại diện</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />

            </section>
            <h2>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
              />
            </h2>
            <p className="student-id">ID Sinh viên: {formData.id || "Chưa có ID"}</p>
            <section className="contact-section">
              <h3>Thông tin liên hệ</h3>
              <p>
                <AiOutlineMail />
                <input
                  type="email"
                  name="schoolEmail"
                  value={formData.schoolEmail || ""}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </p>
              <p>
                <AiOutlineHome />
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  placeholder="Địa chỉ"
                />
              </p>
              <p>
                <AiOutlinePhone />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                />
              </p>
              <p>
                <FaBirthdayCake />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                />
              </p>
              <p>
                <FaMale />
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </p>
            </section>
          </div>

          <div className="profile-edit-details">
            <section>
              <h3>Giới thiệu bản thân</h3>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Nhập giới thiệu bản thân"
              />
            </section>

            <section>
              <h3>Trình độ học vấn</h3>
              <input
                type="text"
                name="education"
                value={formData.education || ""}
                onChange={handleChange}
                placeholder="Nhập trình độ học vấn"
              />
            </section>

            <section>
              <h3>Kỹ năng</h3>
              <input
                type="text"
                name="skills"
                value={formData.skills || ""}
                onChange={handleChange}
                placeholder="Nhập kỹ năng"
              />
            </section>

            <section>
              <h3>Ngôn ngữ</h3>
              <input
                type="text"
                name="languages"
                value={formData.languages || ""}
                onChange={handleChange}
                placeholder="Nhập các ngôn ngữ (cách nhau bằng dấu phẩy)"
              />
            </section>

            <section>
              <h3>GPA</h3>
              <input
                type="text"
                name="gpa"
                value={formData.gpa || ""}
                onChange={handleChange}
                placeholder="Nhập GPA"
              />
            </section>

            <section>
              <h3>Github</h3>
              <input
                type="text"
                name="githubProfile"
                value={formData.githubProfile || ""}
                onChange={handleChange}
                placeholder="Nhập liên kết Github"
              />
            </section>

            <section>
              <h3>CV File</h3>
              <input
                type="file"
                name="cvFile"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </section>

            <div className="profile-edit-actions">
              {!formData.id ? (
                <button onClick={handleCreate} className="save-btn">
                  Lưu (Tạo mới)
                </button>
              ) : (
                <>
                  <button onClick={handleUpdate} className="save-btn">
                    Cập nhật
                  </button>
                  <button onClick={handleDelete} className="delete-btn">
                    Xoá
                  </button>
                </>
              )}
              <button onClick={() => navigate("/studentprofile")} className="cancel-btn">
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileForm;
