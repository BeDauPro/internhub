using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
    public class StudentReview
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        [ForeignKey("Student")]
        public string StudentId { get; set; }
        public virtual Student Student { get; set; }

        [Required]
        [ForeignKey("Employer")]
        public string EmployerId { get; set; }
        public virtual Employer Employer { get; set; }

        [Required]
        [ForeignKey("JobPosting")]
        public int JobPostingId { get; set; }
        public virtual JobPosting JobPosting { get; set; }

        [Required]
        public int OverallRating { get; set; }

        public string Comments { get; set; }

        [Required]
        public string ReviewType { get; set; } // company, job, student

        public DateTime ReviewedAt { get; set; } = DateTime.UtcNow;
    }

}

