using System;
using InternHub.Models.Enums;

namespace InternHub.DTOs.Review
{
    public class StudentReviewCreateDto
    {
        public int StudentId { get; set; }
        public int EmployerId { get; set; }
        public int OverallRating { get; set; }
        public string Comments { get; set; }
        public ReviewerRole ReviewerRole { get; set; }
    }
}

