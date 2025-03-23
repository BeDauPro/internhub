import React from 'react'
import "../../styles/pages/student/notification.scss"

const NotificationItem = ({ logo, title, date }) => {
    return (
        <div className="notification-item">
            <img alt={`Logo of ${title}`} src={logo} />
            <div className="content">
                <p className="title">{title}</p>
                <p className="date">tạo lúc {date}</p>
            </div>
            <span className="status">•</span>
        </div>
    );
};

const Notification = () => {
    return (
        <div className="notification-container">
            <div className="notification-header">
                <h1>Thông báo</h1>
                <button>
                    <i className="fas fa-check-circle"></i> đánh dấu là đã đọc
                </button>
            </div>
            <div className="notification-tabs">
                <button className="active">
                    Khoa <span className="badge badge-primary ml-1">0</span>
                </button>
                <button>
                    Doanh nghiệp <span className="badge badge-secondary ml-1">2</span>
                </button>
            </div>
            <div>
                <NotificationItem
                    logo="https://placehold.co/40x40"
                    title="Talkshow với độc giả"
                    date="12/3/2025"
                />
                <NotificationItem
                    logo="https://placehold.co/40x40"
                    title="Kiến tập ở Fsoft complex"
                    date="12/3/2025"
                />
                <NotificationItem
                    logo="https://placehold.co/40x40"
                    title="Gặp gỡ CEO"
                    date="12/3/2025"
                />
            </div>
        </div>
    )
}

export default Notification
