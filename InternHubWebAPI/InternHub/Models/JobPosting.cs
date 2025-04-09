using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using InternHub.Models.Enums;

namespace InternHub.Models
{
    public class JobPosting
    {
        [Key]
        public int JobPostingId { get; set; }
        public string JobTitle { get; set; }
        public string JobDesc { get; set; }
        public string JobCategory { get; set; }
        public string Location { get; set; }
        public string Salary { get; set; }
        public string WorkType { get; set; } // full-time, part-time, remote, hybrid
        public string ExperienceRequired { get; set; }
        public string SkillsRequired { get; set; }
        public string LanguagesRequired { get; set; }
        public int Vacancies { get; set; }
        public DateTime ApplicationDeadline { get; set; }
        public DateTime PostedAt { get; set; } = DateTime.UtcNow;

        // Khóa ngoại liên kết với Employer
        [ForeignKey("Employer")]
        public int EmployerId { get; set; }
        public virtual Employer Employer { get; set; }

        // Trạng thái duyệt bài đăng - phải là nullable
        public JobpostingStatus? Status { get; set; }

        // Các mối quan hệ với Application và StudentReview
        public virtual ICollection<Application> Applications { get; set; }
        public virtual ICollection<StudentReview> Reviews { get; set; }
    }
}