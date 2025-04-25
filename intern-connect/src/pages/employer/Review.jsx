import React, { useEffect, useState } from 'react';
import { createReview, getReviewsForEmployer } from '../../services/reviewApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import '../../styles/pages/employer/review.scss';
import { getStudentProfile } from '../../services/studentApi';
import { getRoleFromStorage } from '../../services/studentApi';
const Review = ({ employerId, role }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    overallRating: 0,
    comments: '',
  });


  useEffect(() => {
    if (employerId) {
      fetchReviews();
    }
  }, [employerId]);

  const fetchReviews = async () => {
    try {
      const data = await getReviewsForEmployer(employerId);
      const studentData = await getStudentProfile();
      const role = getRoleFromStorage();
      setReviews(data);
      setNewReview({...newReview, studentId: studentData.id, reviewerRole: role});
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.comments || newReview.overallRating === 0) {
      alert("Vui lòng nhập đầy đủ nội dung và đánh giá sao");
      return;
    }

    try {
      await createReview({ ...newReview, employerId: parseInt(employerId) });
      setNewReview({ overallRating: 0, comments: '' });
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      overallRating: rating,
    }));
  };

  return (
    <div className="container-review">
      <h2 className="mb-4">Nhận xét về công ty</h2>

      <div className="list-group">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="list-group-item d-flex align-items-start">
              <img
                src={review.studentAvatar}
                alt={review.studentName}
                className="rounded-circle mr-3"
                style={{ width: '80px', height: '80px' }}
              />
              <div className="flex-grow-1">
                <h5>{review.studentName}</h5>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className={i < review.overallRating ? 'text-warning' : 'text-muted'}
                    />
                  ))}
                </div>
                <p>{review.comments}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào cho công ty này.</p>
        )}
      </div>

      {/* ✅ Chỉ hiển thị form nếu là sinh viên */}
      {role === 'Student' && (
        <div className="container-comment mt-5">
          <h2 className="mb-3">Thêm nhận xét</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Chọn đánh giá của bạn</label>
              <div>
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={i < newReview.overallRating ? 'text-warning' : 'text-muted'}
                    onClick={() => handleRatingClick(i + 1)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Viết nhận xét của bạn</label>
              <textarea
                className="form-control"
                id="comment"
                placeholder="Viết nhận xét..."
                rows="4"
                value={newReview.comments}
                onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })}
              ></textarea>
            </div>
            <button className="btn btn-primary" type="submit">Gửi</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Review;
