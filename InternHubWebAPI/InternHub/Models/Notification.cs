using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }

        [Required]
        public string Content { get; set; }

        public string LinkUrl { get; set; }

        public string Status { get; set; } = "unread"; // read, unread

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("Student")]
        public string RecipientStudentId { get; set; }
        public virtual Student RecipientStudent { get; set; }

        [ForeignKey("Employer")]
        public string RecipientEmployerId { get; set; }
        public virtual Employer RecipientEmployer { get; set; }
    }

}

