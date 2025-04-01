using System;
using Microsoft.AspNetCore.Identity;

namespace InternHub.Models
{
	public class ApplicationUser: IdentityUser
	{
		public string Custom { get; set; }
	}
}

