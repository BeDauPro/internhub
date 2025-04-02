using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace InternHub.Models
{
	public class Admin : ApplicationUser
    {
        [Required]
        public string Role { get; set; } = "Admin";
    }
}

