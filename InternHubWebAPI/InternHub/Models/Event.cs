using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
    public class Event
    {
        [Key]
        public int EventId { get; set; }

        [Required]
        public string EventTitle { get; set; }

        public string EventDesc { get; set; }
        public DateTime EventDate { get; set; }
        public string EventLocation { get; set; }
        public string Organizer { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("Admin")]
        public int CreatedByAdminId { get; set; }
        public virtual Admin Admin { get; set; }
    }

}

