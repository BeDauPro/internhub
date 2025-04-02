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

        [Required]
        public DateTime EventDate { get; set; }

        public string EventLocation { get; set; }
        public string Organizer { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("ApplicationUser")]
        public string CreatorUserId { get; set; }
        public virtual ApplicationUser Creator { get; set; }
    }
}

