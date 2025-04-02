using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
    public class ApplicationHistory
    {
        [Key]
        public int WorkHistoryId { get; set; }

        public string JobTitle { get; set; }
        public string CompanyName { get; set; }

        public DateTime ApplicationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [ForeignKey("Student")]
        public string StudentId { get; set; }
        public virtual Student Student { get; set; }
    }

}

