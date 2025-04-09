using System;

namespace InternHub.DTOs.Admin
{
    public class EmployerAccountResponseDto
    {
        // Thông tin từ AspNetUsers
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        // Thông tin từ Employer
        public int EmployerId { get; set; }
        public DateTime CreatedAt { get; set; }

        // Role luôn là "Employer"
        public string Role { get; set; } = "Employer";
    }
}