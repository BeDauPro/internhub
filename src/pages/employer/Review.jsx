import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import "../../styles/pages/employer/review.scss";
import avatar from "../../images/avatar.jpg";

const Review = () => {
  const loggedInUser = {
    name: "Nguyen Van A",
    avatar: {avatar},
  };

  const [formReview, setFormReview] = useState({
    name: loggedInUser.name,
    text: "",
    rating: 0,
    imgSrc: loggedInUser.avatar,
  });

  const [reviews, setReviews] = useState([
    {
      name: 'Nguyen Đuc',
      text: 'Các anh chị mentor rất thân thiện, hướng dẫn, chỉ dạy nhiệt tình, chu đáo. Xứng đáng là môi trường thực tập tốt nhất Việt Nam.',
      rating: 5,
      imgSrc: 'https://storage.googleapis.com/a1aa/image/D91cQhagVVi70nxKj8yih2EgR5Y7PzOgVo0tO_t2sfE.jpg',
    },
    {
      name: 'Sơn Tùng MTP',
      text: 'Các anh chị mentor rất thân thiện, hướng dẫn, chỉ dạy nhiệt tình, chu đáo. Xứng đáng là môi trường thực tập tốt nhất Việt Nam.',
      rating: 3,
      imgSrc: 'https://storage.googleapis.com/a1aa/image/9do6e4N20k9FQ_tBwb-0jV1l1B62dv4NnlCzp6lIko8.jpg',
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormReview({ ...formReview, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setFormReview({ ...formReview, rating });
  };

  const handleSubmit = () => {
    const { name, text, rating, imgSrc } = formReview;

    if (!text || rating === 0) {
      alert("Vui lòng điền đầy đủ thông tin và chọn đánh giá!");
      return;
    }

    const newReview = {
      name,
      text,
      rating,
      imgSrc,
    };

    setReviews([...reviews, newReview]);
    alert("Đã gửi đánh giá!");
    clearForm();
  };

  const clearForm = () => {
    setFormReview({
      ...formReview,
      text: "",
      rating: 0,
    });
  };

  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#123082';

  return (
    <div>
      <div className="container-review">
        <h2 className="mb-4" style={{ color: primaryColor }}>Nhận xét về công ty</h2>
        <div className="list-group">
          {reviews.map((review, index) => (
            <div key={index} className="list-group-item">
              <div className="d-flex align-items-start">
                <img
                  src={review.imgSrc}
                  alt={`Portrait of ${review.name}`}
                  className="rounded-circle mr-3"
                  style={{ width: '110px', height: '110px' }}
                />
                <div className="flex-grow-1">
                  <h5 style={{ color: primaryColor }}>{review.name}</h5>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={i < review.rating ? 'text-warning' : 'text-muted'}
                      />
                    ))}
                  </div>
                  <p className="text-secondary">{review.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container-comment">
        <h2 className="mb-4" style={{ color: primaryColor }}>Thêm nhận xét</h2>
        <div className="mb-3">
          <label className="form-label">Chọn đánh giá của bạn</label>
          <div>
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={i < formReview.rating ? 'text-warning' : 'text-muted'}
                onClick={() => handleRatingChange(i + 1)}
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
            name="text"
            value={formReview.text}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>Gửi</button>
      </div>
    </div>
  );
};

export default Review;




