import React, { useEffect, useState } from 'react';
import { createReview, getReviewsForStudent } from '../../services/reviewApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import '../../styles/pages/employer/review.scss';
import { getRoleFromStorage } from '../../services/studentApi';
import { getEmployerProfile } from '../../services/employerApi';

const Evaluate = ({ studentId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    overallRating: 0,
    comments: '',
  });
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (studentId) {
      fetchReviews();
    }
  }, [studentId]);

  const fetchReviews = async () => {
    try {
      const data = await getReviewsForStudent(studentId);
      const employData = await getEmployerProfile();
      const roleFromStorage = getRoleFromStorage();      
      setReviews(data);
      setNewReview({
        ...newReview,
        employerId: employData.employerId,
        reviewerRole: roleFromStorage,
      });
      setUserRole(roleFromStorage); // lưu role riêng
    } catch (error) {
      console.error('Lỗi khi lấy đánh giá:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.comments || newReview.overallRating < 1 || newReview.overallRating > 10) {
      alert('Vui lòng nhập đầy đủ nhận xét và điểm từ 1 đến 10');
      return;
    }

    try {
      console.log('Đánh giá:', newReview);
      await createReview({ ...newReview, studentId });
      // khi submit => parseInt
      setNewReview({ overallRating: 0, comments: '' });
      fetchReviews();
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="container-review">
      <h2 className="mb-4">Đánh giá sinh viên</h2>

      <div className="list-group">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="list-group-item">
              <h5>{review.employerName}</h5>
              <p><strong>Điểm:</strong> {review.overallRating}/10</p>
              <p>{review.comments}</p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào cho sinh viên này.</p>
        )}
      </div>

      {userRole === 'Employer' && (
        <div className="container-comment mt-5">
          <h2 className="mb-3">Thêm nhận xét</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nhập điểm đánh giá (1 - 10)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                value={newReview.overallRating}
                onChange={(e) =>
                  setNewReview({ ...newReview, overallRating: parseInt(e.target.value)})
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Viết nhận xét</label>
              <textarea
                className="form-control"
                id="comment"
                placeholder="Nhận xét chi tiết..."
                rows="4"
                value={newReview.comments}
                onChange={(e) =>
                  setNewReview({ ...newReview, comments: e.target.value })
                }
              ></textarea>
            </div>
            <button className="btn btn-primary" type="submit">Gửi đánh giá</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Evaluate;
