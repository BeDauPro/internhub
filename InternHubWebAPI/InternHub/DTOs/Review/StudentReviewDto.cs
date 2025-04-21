using System;
namespace InternHub.DTOs.Review
{
    public class StudentReviewDto
    {
        public int ReviewId { get; set; }
        public int OverallRating { get; set; }
        public string Comments { get; set; }
        public DateTime ReviewedAt { get; set; }

        public int StudentId { get; set; }
        public string StudentName { get; set; }
        public string StudentAvatar { get; set; }

        public int EmployerId { get; set; }
        public string EmployerName { get; set; }
        public string EmployerLogo { get; set; }
    }
}


