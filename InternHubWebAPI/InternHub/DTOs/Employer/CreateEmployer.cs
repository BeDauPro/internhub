using System;
namespace InternHub.DTOs.Employer
{
	public class CreateEmployer
	{
        public string? CompanyName { get; set; }
        public string? CompanyEmail { get; set; }
        public string? Phone { get; set; }
        public IFormFile? CompanyLogo { get; set; }
        public string? CompanyDescription { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
        public string? Industry { get; set; }
        public int? EmployeeSize { get; set; }
        public int? FoundedYear { get; set; }
    }
}

