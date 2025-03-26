import React, { useState } from 'react';
import '../../styles/pages/student/Evaluate.scss'
import { AiOutlineSend } from 'react-icons/ai';
import fptLogo from '../../images/fpt.jpg';

const Evaluate = () => {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([
        {
            company: "FPT Software",
            overallScore: "10/10",
            reviewText: "Có chí tiến thủ, siêng năng, cầu tiến và luôn hoàn thành task đúng thời hạn. Tiếp tục phát huy tinh thần và chuẩn bị thật kỹ kiến thức để phỏng vấn vào vị trí fresher sắp tới em nhé."
        }
    ]);

    const handleSubmit = () => {
        if (!rating || !comment) {
            alert('Vui lòng nhập đủ thông tin!');
            return;
        }
        const newReview = {
            company: "FPT Software",
            overallScore: rating,
            reviewText: comment
        };
        setReviews([...reviews, newReview]);
        setRating('');
        setComment('');
    };

    return (
        <div className="review-container">
            <div className="review-card">
                <h3>Đánh giá của nhà tuyển dụng</h3>
                {reviews.map((review, index) => (
                    <div key={index} className="review-content">
                        <img src={fptLogo} alt="FPT Logo" className="company-logo" />
                        <h4>{review.company}</h4>
                        <p><strong>Điểm tổng quát:</strong> {review.overallScore}</p>
                        <p><strong>Đánh giá:</strong> {review.reviewText}</p>
                    </div>
                ))}
            </div>

            <div className="comment-section">
                <h3>Thêm nhận xét</h3>
                <input
                    type="text"
                    placeholder="Nhập điểm..."
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
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
        </div>
    )
}

export default Evaluate
