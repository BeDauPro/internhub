using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace InternHub.Models
{
	public class Employer : ApplicationUser
    {
        [Required]
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public string CompanyDescription { get; set; }
        public string Address { get; set; }
        public string Website { get; set; }
        public string Industry { get; set; }
        public int EmployeeSize { get; set; }
        public int? FoundedYear { get; set; }
    }
}

