using System;
namespace InternHub.Models.ViewModels
{
	public class User : ApplicationUser
	{
        public string Phone { get; set; }
        public string UserType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual Student Student { get; set; }
        public virtual Employer Employer { get; set; }
        public virtual Admin Admin { get; set; }
    }
}

