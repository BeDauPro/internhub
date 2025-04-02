using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
    public class JobPosting
    {
        [Key]
        public int JobPostingId { get; set; }

        [Required]
        [ForeignKey("Employer")]
        public string EmployerId { get; set; }
        public virtual Employer Employer { get; set; }

        [Required]
        public string JobTitle { get; set; }

        public string JobDesc { get; set; }
        public string JobCategory { get; set; }
        public string Location { get; set; }
        public string Salary { get; set; }

        [Required]
        public string WorkType { get; set; } // full-time, part-time, remote, hybrid

        public string ExperienceRequired { get; set; }
        public int Vacancies { get; set; }

        public string SkillsRequired { get; set; }
        public string LanguagesRequired { get; set; }

        public DateTime PostedAt { get; set; } = DateTime.UtcNow;
    }

}

