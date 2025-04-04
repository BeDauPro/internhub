using System;

namespace InternHub.Models.ViewModels
{ 
 
    public class JobPostingViewModel 
    {
        public int JobPostingId { get; set; }
        public string JobTitle { get; set; }
        public string JobCategory { get; set; }
        public string Location { get; set; }
        public string WorkType { get; set; }
        public int Vacancies { get; set; }
        public DateTime PostedAt { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
    }
}