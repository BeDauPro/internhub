using System;
using System.ComponentModel.DataAnnotations;

namespace InternHub.DTOs
{
    public class EventCreateDto
    {
        [Required]
        public string EventTitle { get; set; }

        public string EventDesc { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime EventDate { get; set; }

        public string EventLocation { get; set; }

        public string Organizer { get; set; }
    }

    public class EventUpdateDto
    {
        [Required]
        public string EventTitle { get; set; }

        public string EventDesc { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime EventDate { get; set; }

        public string EventLocation { get; set; }

        public string Organizer { get; set; }
    }

    public class EventResponseDto
    {
        public int EventId { get; set; }
        public string EventTitle { get; set; }
        public string EventDesc { get; set; }
        public DateTime EventDate { get; set; }
        public string EventLocation { get; set; }
        public string Organizer { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedByAdminId { get; set; }
        public string AdminName { get; set; }
    }
}