using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using InternHub.Models.ViewModels;
using Microsoft.AspNetCore.Identity;

namespace InternHub.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required, EmailAddress]
        public string SchoolEmail { get; set; }

        public string ProfilePicture { get; set; }
        public string Bio { get; set; }
        public string Address { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public string Gender { get; set; } // male, female, other
        public decimal? GPA { get; set; }
        public string Skills { get; set; }
        public string Languages { get; set; }
        public string GithubProfile { get; set; }
        public string CVFile { get; set; }

        public string Status { get; set; } = "pending"; // pending, reviewed, internship, completed
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<ApplicationHistory> ApplicationHistories { get; set; }
        public virtual ICollection<StudentReview> Reviews { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
        public virtual ICollection<Application> Applications { get; set; }
    }

}

