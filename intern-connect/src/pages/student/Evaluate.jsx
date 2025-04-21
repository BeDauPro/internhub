// src/pages/student/Evaluate.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/pages/student/Evaluate.scss';
import { AiOutlineSend } from 'react-icons/ai';
import fptLogo from '../../images/fpt.jpg';
import { getReviewsForStudent, createReview } from '../../services/reviewApi';

const Evaluate = ({ studentId, role }) => {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const isEmployer = role === 'Employer';

    useEffect(() => {
        if (studentId) {
            fetchReviews();
        }
    }, [studentId]);

    const fetchReviews = async () => {
        try {
            const data = await getReviewsForStudent(studentId);
            setReviews(data);
        } catch (error) {
            console.error("Lỗi khi lấy đánh giá:", error);
        }
    };

    const handleSubmit = async () => {
        if (!rating || !comment) {
            alert('Vui lòng nhập đủ thông tin!');
            return;
        }

        try {
            await createReview({
                reviewedUserId: studentId,
                reviewerRole: 'Employer',
                overallRating: parseFloat(rating),
                comments: comment,
            });
            setRating('');
            setComment('');
            fetchReviews();
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
        }
    };

    return (
        <div className="review-container">
            <div className="review-card">
                <h3>Đánh giá từ nhà tuyển dụng</h3>
                {reviews.length === 0 && <p>Chưa có đánh giá nào.</p>}
                {reviews.map((review, index) => (
                    <div key={index} className="review-content">
                        <img src={review.employerLogo || fptLogo} alt="Employer Logo" className="company-logo" />
                        <h4>{review.employerName || "Tên công ty"}</h4>
                        <p><strong>Điểm tổng quát:</strong> {review.overallRating}</p>
                        <p><strong>Đánh giá:</strong> {review.comments}</p>
                    </div>
                ))}
            </div>

            {/* ✅ Chỉ nhà tuyển dụng mới có form thêm đánh giá */}
            {isEmployer && (
                <div className="comment-section">
                    <h3>Thêm nhận xét</h3>
                    <input
                        type="number"
                        placeholder="Nhập điểm (1 - 10)..."
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        min="1"
                        max="10"
                    />
                    <textarea
                        placeholder="Thêm đánh giá..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button onClick={handleSubmit}>
                        Gửi <AiOutlineSend />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Evaluate;
