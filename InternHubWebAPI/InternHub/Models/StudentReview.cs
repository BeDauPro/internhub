using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using InternHub.Models.Enums;
using Microsoft.EntityFrameworkCore;

    namespace InternHub.Models
    {
    public class StudentReview
    {
        [Key]
        public int ReviewId { get; set; }

        public int OverallRating { get; set; }
        public string Comments { get; set; }
        public DateTime ReviewedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public virtual Student Student { get; set; }

        [ForeignKey("Employer")]
        public int EmployerId { get; set; }
        public virtual Employer Employer { get; set; }

        public ReviewerRole ReviewerRole { get; set; }

        public static void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StudentReview>()
                .HasIndex(sr => new { sr.StudentId, sr.EmployerId, sr.ReviewerRole })
                .IsUnique();
        }
    }
    }