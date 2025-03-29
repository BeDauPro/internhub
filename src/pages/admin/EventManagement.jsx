import { React, useState } from 'react';
import { FaPencilAlt, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaAlignLeft } from 'react-icons/fa'; // Import icons
import "bootstrap/dist/css/bootstrap.min.css"
import "../../styles/pages/admin/EventManagement.scss"
import NavbarAdmin from '../../components/admin/NavbarAdmin';
import Footer from '../../components/Footer';

const EventManagement = ({ events: initialEvents }) => {
    const [events, setEvents] = useState(initialEvents || []); // Manage events locally
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        organizer: "",
        date: "",
        content: "",
    });
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        const { title, location, organizer, date, content } = formData;

        if (!title || !location || !organizer || !date || !content ) {
            alert("Vui lòng điền đầy đủ thông tin sự kiện!");
            return;
        }

        if (selectedEvent) {
            const updatedEvents = events.map((event) =>
                event.id === selectedEvent.id
                    ? { ...event, title, location, organizer, date, content }
                    : event
            );
            setEvents(updatedEvents); // Update local state
            alert("Đã cập nhật sự kiện!");
        } else {
            const newEvent = {
                id: events.length + 1,
                title,
                location,
                organizer,
                date,
                content,
            };
            setEvents([...events, newEvent]); // Add new event to local state
            alert("Đã thêm sự kiện mới!");
        }
        clearForm();
    };

    const handleDelete = () => {
        if (selectedEvent) {
            const updatedEvents = events.filter((event) => event.id !== selectedEvent.id);
            setEvents(updatedEvents); // Update local state
            alert("Đã xoá sự kiện!");
        } else {
            alert("Không có sự kiện nào được chọn để xoá!");
        }
        clearForm();
        setSelectedEvent(null);
    };

    const handleAddEvent = () => {
        clearForm();
        setSelectedEvent(null);
    };

    const clearForm = () => {
        setFormData({
            title: "",
            location: "",
            organizer: "",
            date: "",
            content: "",
        });
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            location: event.location,
            organizer: event.organizer,
            date: event.date,
            content: event.content,
        });
    };

    return (
        <>
        <NavbarAdmin/>
        <div className="container">
            <div className="event-container">
                <h2 className="text-center mb-4 event-title">Sự kiện</h2>

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
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="event-item"
                                    onClick={() => handleEventClick(event)}
                                >
                                    <div className="event-item-title">{event.title}</div>
                                    <div className="event-item-location">
                                        <span className="location-icon me-1">◎</span> {event.location}
                                    </div>
                                </div>
                            ))}
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
                                    name="title"
                                    className="form-control bg-light rounded"
                                    placeholder="Vui lòng viết tiêu đề của sự kiện..."
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-1">
                                <label className="form-label">
                                    <FaMapMarkerAlt /> Địa điểm tổ chức
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    className="form-control bg-light rounded"
                                    placeholder="Nhập địa điểm tổ chức..."
                                    value={formData.location}
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
                                    name="date"
                                    className="form-control bg-light rounded"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label">
                                    <FaAlignLeft /> Nội dung sự kiện
                                </label>
                                <textarea
                                    name="content"
                                    className="form-control bg-light rounded content-textarea"
                                    placeholder="Vui lòng viết nội dung của sự kiện..."
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows="10"
                                />
                            </div>

                            <div className="d-flex justify-content-end">
                                <button className="btn btn-outline-danger me-2" onClick={handleDelete}>
                                    Xoá
                                </button>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default EventManagement
