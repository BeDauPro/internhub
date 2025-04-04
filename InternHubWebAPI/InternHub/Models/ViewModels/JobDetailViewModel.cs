using System;

namespace InternHub.Models.ViewModels
{
    public class JobDetailViewModel
    {
        // Thông tin công việc
        public int JobPostingId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string JobDesc { get; set; } = string.Empty;
        public string JobCategory { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Salary { get; set; } = string.Empty;
        public string WorkType { get; set; } = string.Empty;
        public string ExperienceRequired { get; set; } = string.Empty;
        public string SkillsRequired { get; set; } = string.Empty;
        public string LanguagesRequired { get; set; } = string.Empty;
        public int Vacancies { get; set; }
        public DateTime PostedAt { get; set; }

        // Thông tin công ty
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyLogo { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}