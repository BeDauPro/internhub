using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Content { get; set; }

        public string LinkUrl { get; set; }

        [Required]
        public string Status { get; set; } = "unread"; // read, unread

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Chỉ Admin có quyền gửi thông báo
        [ForeignKey("Admin")]
        public int AdminId { get; set; }  
        public virtual Admin Admin { get; set; }

        // Chỉ Student nhận thông báo
        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public virtual Student Student { get; set; }

    }
}
