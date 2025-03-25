import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import "../../styles/pages/employer/review.scss";

const reviews = [
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
  ];

const Review = () => {
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#123082';
  const buttonColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#123082';
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
                  style={{ width: '120px', height: '120px' }}
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
          <label className="form-label">Add your rating</label>
          <div>
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
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
          ></textarea>
        </div>
        <button className="btn btn-primary">Gửi</button>
      </div>
    </div>
  );
};

export default Review;




