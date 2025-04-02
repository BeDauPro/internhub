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
        [ForeignKey("Student")]
        public string StudentId { get; set; }
        public virtual Student Student { get; set; }

        [Required]
        [ForeignKey("JobPosting")]
        public int JobPostingId { get; set; }
        public virtual JobPosting JobPosting { get; set; }

        public string Resume { get; set; }

        public string ApplicationStatus { get; set; } = "pending"; // pending, reviewed, internship, completed

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
    }

}

