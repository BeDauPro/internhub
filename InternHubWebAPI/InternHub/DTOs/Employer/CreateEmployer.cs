using System;
using System.ComponentModel.DataAnnotations;

namespace InternHub.DTOs.Employer
{
	public class CreateEmployer
	{
        public string? CompanyName { get; set; }
        public string? CompanyEmail { get; set; }
        [RegularExpression(@"^\d{9,11}$", ErrorMessage = "Số điện thoại phải từ 9-11 chữ số.")]
        public string? Phone { get; set; }
        public IFormFile? CompanyLogo { get; set; }
        public string? CompanyDescription { get; set; }
        public string? Address { get; set; }
        public string? Website { get; set; }
        public string? Industry { get; set; }
        public int? EmployeeSize { get; set; }
        [Range(1900, 2100)]
        public int? FoundedYear { get; set; }
    }
}

