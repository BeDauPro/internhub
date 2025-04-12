import React, { useState } from 'react';
import { FaMapMarkerAlt, FaUser, FaCalendarAlt, FaAlignLeft } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/pages/student/eventstudent.scss"
import Footer from '../../components/Footer';

const EventStudent = ({ events }) => {
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Function to handle event click
    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <>
            <div className="container mt-4">
                <div className="student-event-container">
                    <h2 className="text-center mb-4 event-title">Sự kiện</h2>

                    <div className="row event-content-wrapper">
                        <div className="col-md-4 p-0 event-list-container">
                            <div className="event-list-header rounded-top">Danh sách sự kiện</div>

                            <div className="event-list">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        className={`event-item ${selectedEvent && selectedEvent.id === event.id ? 'selected' : ''}`}
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <div className="event-item-title">{event.title}</div>
                                        <div className="event-item-location">
                                            <span className="location-icon me-1">◎</span> {event.location}
                                        </div>
                                        <div className="event-item-date">
                                            <FaCalendarAlt className="me-1" /> {formatDate(event.date)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-md-8 p-0 event-detail-container">
                            {selectedEvent ? (
                                <div className="event-detail p-4">
                                    <h3 className="event-detail-title mb-4">{selectedEvent.title}</h3>
                                    <div className="event-info mb-3">
                                        <div className="event-info-item">
                                            <FaMapMarkerAlt className="event-info-icon" />
                                            <span className="event-info-label">Địa điểm:</span>
                                            <span className="event-info-text">{selectedEvent.location}</span>
                                        </div>
                                        <div className="event-info-item">
                                            <FaUser className="event-info-icon" />
                                            <span className="event-info-label">Người tổ chức:</span>
                                            <span className="event-info-text">{selectedEvent.organizer}</span>
                                        </div>
                                        <div className="event-info-item">
                                            <FaCalendarAlt className="event-info-icon" />
                                            <span className="event-info-label">Thời gian:</span>
                                            <span className="event-info-text">{formatDate(selectedEvent.date)}</span>
                                        </div>
                                    </div>
                                    <div className="event-content-section">
                                        <div className="event-info-item align-items-start">
                                            <FaAlignLeft className="event-info-icon mt-1" />
                                            <span className="event-info-label">Nội dung:</span>
                                        </div>
                                        <div className="event-content-text mt-2">
                                            {selectedEvent.content}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-event-selected">
                                    <div className="text-center my-5 text-muted">
                                        <img
                                            src="/images/event-select.svg"
                                            alt="Select an event"
                                            className="no-event-img mb-3"
                                            style={{ maxWidth: '150px', opacity: 0.5 }}
                                        />
                                        <h5>Vui lòng chọn một sự kiện để xem chi tiết</h5>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EventStudent;
