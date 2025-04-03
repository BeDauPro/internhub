using System;
using Microsoft.AspNetCore.Identity;

namespace InternHub.Models
{
	public class ApplicationUser: IdentityUser
	{
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? Custom { get; set; }
        public string? VerificationToken { get; set; } 
    }
}

