import { React, useState, useEffect } from 'react';
import { FaPencilAlt, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaAlignLeft } from 'react-icons/fa'; // Import icons
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/pages/admin/EventManagement.scss";
import Footer from '../../components/Footer';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../../services/adminApi';

const EventManagement = () => {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        eventTitle: "",
        eventLocation: "",
        organizer: "",
        eventDate: "",
        eventDesc: "",
    });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch events when component mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const data = await getAllEvents();
                setEvents(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Không thể tải dữ liệu sự kiện. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        // Kiểm tra dữ liệu đầu vào
        const { eventTitle, eventLocation, organizer, eventDate, eventDesc } = formData;

        if (!eventTitle || !eventLocation || !organizer || !eventDate || !eventDesc) {
            alert("Vui lòng điền đầy đủ thông tin sự kiện!");
            return;
        }

        try {
            // Chuẩn bị dữ liệu gửi đi
            const eventData = {
                eventTitle,
                eventDesc,
                eventDate,
                eventLocation,
                organizer
            };

            let response;
            if (selectedEvent) {
                // Cập nhật sự kiện
                response = await updateEvent(selectedEvent.eventId, eventData);
                
                // Cập nhật state local
                setEvents(events.map(event => 
                    event.eventId === selectedEvent.eventId ? response : event
                ));
                
                alert("Đã cập nhật sự kiện thành công!");
            } else {
                // Tạo sự kiện mới
                response = await createEvent(eventData);
                
                // Thêm vào state local
                setEvents([...events, response]);
                
                alert("Đã thêm sự kiện thành công!");
            }
            
            // Reset form và trạng thái
            clearForm();
            setSelectedEvent(null);
            
        } catch (err) {
            console.error("Error saving event:", err);
            alert("Lỗi khi lưu sự kiện: " + (err.data?.error || err.data?.message || "Lỗi không xác định"));
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent) {
            alert("Không có sự kiện nào được chọn để xoá!");
            return;
        }

        try {
            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?");
            
            if (confirmDelete) {
                await deleteEvent(selectedEvent.eventId);
                
                // Cập nhật state local
                setEvents(events.filter(event => event.eventId !== selectedEvent.eventId));
                
                alert("Đã xoá sự kiện thành công!");
                clearForm();
                setSelectedEvent(null);
            }
        } catch (err) {
            console.error("Error deleting event:", err);
            alert("Lỗi khi xoá sự kiện: " + (err.data?.error || err.data?.message || "Lỗi không xác định"));
        }
    };

    const handleAddEvent = () => {
        clearForm();
        setSelectedEvent(null);
    };

    const clearForm = () => {
        setFormData({
            eventTitle: "",
            eventLocation: "",
            organizer: "",
            eventDate: "",
            eventDesc: "",
        });
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        
        // Format date for input type="date" (YYYY-MM-DD)
        const formattedDate = event.eventDate ? event.eventDate.split('T')[0] : "";
        
        setFormData({
            eventTitle: event.eventTitle || "",
            eventLocation: event.eventLocation || "",
            organizer: event.organizer || "",
            eventDate: formattedDate,
            eventDesc: event.eventDesc || "",
        });
    };

    if (isLoading) {
        return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="alert alert-danger m-5">{error}</div>;
    }

    return (
        <>
        <div className="container">
            <div className="event-container">
                <h2 className="text-center mb-4 event-title">Quản lý sự kiện</h2>

                <div className="row event-content-wrapper">
                    <div className="col-md-4 p-0 event-list-container">
                        <div className="event-list-header rounded-top">Danh sách sự kiện</div>

                        <button
                            className="btn add-event-btn w-100 d-flex align-items-center justify-content-center"
                            onClick={handleAddEvent}
                        >
                            <span className="plus-icon me-2">+</span> Thêm sự kiện
                        </button>

                        <div className="event-list">
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <div
                                        key={event.eventId}
                                        className={`event-item ${selectedEvent && selectedEvent.eventId === event.eventId ? 'selected' : ''}`}
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <div className="event-item-title">{event.eventTitle}</div>
                                        <div className="event-item-location">
                                            <span className="location-icon me-1">◎</span> {event.eventLocation}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-events p-3 text-center">Không có sự kiện nào</div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-8 p-0 event-form-container">
                        <div className="event-form p-4">
                            <div className="mb-1">
                                <label className="form-label">
                                    <FaPencilAlt /> Tiêu đề sự kiện
                                </label>
                                <input
                                    type="text"
                                    name="eventTitle"
                                    className="form-control bg-light rounded"
                                    placeholder="Vui lòng viết tiêu đề của sự kiện..."
                                    value={formData.eventTitle}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-1">
                                <label className="form-label">
                                    <FaMapMarkerAlt /> Địa điểm tổ chức
                                </label>
                                <input
                                    type="text"
                                    name="eventLocation"
                                    className="form-control bg-light rounded"
                                    placeholder="Nhập địa điểm tổ chức..."
                                    value={formData.eventLocation}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-1">
                                <label className="form-label">
                                    <FaUser /> Người tổ chức
                                </label>
                                <input
                                    type="text"
                                    name="organizer"
                                    className="form-control bg-light rounded"
                                    placeholder="Nhập người tổ chức..."
                                    value={formData.organizer}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-1">
                                <label className="form-label">
                                    <FaCalendarAlt /> Ngày tổ chức
                                </label>
                                <input
                                    type="date"
                                    name="eventDate"
                                    className="form-control bg-light rounded"
                                    value={formData.eventDate}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    <FaAlignLeft /> Nội dung sự kiện
                                </label>
                                <textarea
                                    name="eventDesc"
                                    className="form-control bg-light rounded content-textarea"
                                    placeholder="Vui lòng viết nội dung của sự kiện..."
                                    value={formData.eventDesc}
                                    onChange={handleInputChange}
                                    rows="10"
                                />
                            </div>

                            <div className="d-flex justify-content-end">
                                <button 
                                    className="btn btn-outline-danger me-2" 
                                    onClick={handleDelete}
                                    disabled={!selectedEvent}
                                >
                                    Xoá
                                </button>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    {selectedEvent ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default EventManagement;