﻿using System;
namespace InternHub.Models.ViewModels
{
	public class AuthResultViewModel
	{
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}

