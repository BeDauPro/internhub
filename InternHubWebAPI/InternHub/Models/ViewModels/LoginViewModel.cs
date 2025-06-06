﻿using System;
using System.ComponentModel.DataAnnotations;

namespace InternHub.Models.ViewModels
{
	public class LoginViewModel
	{
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}

