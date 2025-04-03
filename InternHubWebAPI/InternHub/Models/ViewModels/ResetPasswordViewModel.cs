using System.ComponentModel.DataAnnotations;
using InternHub.Attributes;

namespace InternHub.Models.ViewModels
{
    public class ResetPasswordViewModel
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required, StrongPassword] 
        public string NewPassword { get; set; } 

        [Required, Compare("NewPassword", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } 
    }
}
