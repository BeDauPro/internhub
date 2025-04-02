using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
    public class Application
    {
        [Key]
        public int ApplicationId { get; set; }

        [Required]
        public int StudentId { get; set; }
        public virtual Student Student { get; set; }

        [Required]
        public int JobPostingId { get; set; }
        public virtual JobPosting JobPosting { get; set; }

        public DateTime ApplicationDate { get; set; }
        public string Status { get; set; } = "pending"; // pending, reviewed, accepted, rejected, internship, completed

        public virtual ICollection<ApplicationHistory> ApplicationHistories { get; set; }
    }

}
