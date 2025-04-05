using System;
using System.ComponentModel.DataAnnotations;
using InternHub.Attributes;

namespace InternHub.Models.ViewModels
{
    public class RegisterViewModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required, StrongPassword]
        public string Password { get; set; }

        [Required, Compare("Password")]
        public string ConfirmPassword { get; set; }
    }
}

