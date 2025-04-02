using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
    public class ApplicationHistory
    {
        [Key]
        public int WorkHistoryId { get; set; }

        [Required]
        public string JobTitle { get; set; }

        [Required]
        public string CompanyName { get; set; }

        public DateTime ApplicationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Mối quan hệ với Student
        [Required]
        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public virtual Student Student { get; set; }

        // Mối quan hệ với Employer
        [Required]
        [ForeignKey("Employer")]
        public int EmployerId { get; set; }
        public virtual Employer Employer { get; set; }

        // Mối quan hệ với JobPosting
        [Required]
        [ForeignKey("JobPosting")]
        public int JobPostingId { get; set; }
        public virtual JobPosting JobPosting { get; set; }

        // Trạng thái ứng tuyển: pending, reviewed, internship, completed, etc.
        [Required]
        public string Status { get; set; }

        // Các ghi chú bổ sung cho ứng tuyển
        public string Remarks { get; set; }

        // Đánh dấu khi sinh viên đã có internship (không thay đổi trạng thái nữa)
        public bool IsLocked { get; set; } = false;

        // Kiểm tra xem trạng thái có thể thay đổi hay không
        public bool CanChangeStatus()
        {
            return Status != "internship" && Status != "completed";
        }
    }
}
