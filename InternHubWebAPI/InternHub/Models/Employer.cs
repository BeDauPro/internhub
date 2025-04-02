using System;
using System.ComponentModel.DataAnnotations;
using InternHub.Models.ViewModels;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace InternHub.Models
{
    public class Employer
    {
        [Key]
        public int EmployerId { get; set; }

        public string CompanyName { get; set; }
        public string Phone { get; set; }
        public string CompanyLogo { get; set; }
        public string CompanyDescription { get; set; }
        public string Address { get; set; }
        public string Website { get; set; }
        public string Industry { get; set; }
        public int EmployeeSize { get; set; }
        public int FoundedYear { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<JobPosting> JobPostings { get; set; }
        public virtual ICollection<StudentReview> Reviews { get; set; }
    }

}

