using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace InternHub.Models
{
    public class Student : ApplicationUser
    {
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
    }
}

