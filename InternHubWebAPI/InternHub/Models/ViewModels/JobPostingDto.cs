using System;
using System.ComponentModel.DataAnnotations;

namespace InternHub.Models.ViewModels
{
    // DTO cơ sở chứa các trường chung cho các thao tác CRUD
    public class JobPostingBaseDto
    {
        // Thông tin từ bảng JobPosting
        public string JobTitle { get; set; }
        public string Salary { get; set; }
        public string ExperienceRequired { get; set; }
        public string JobDesc { get; set; }
        public string SkillsRequired { get; set; }
        public string LanguagesRequired { get; set; }
        public int Vacancies { get; set; }
        public string JobCategory { get; set; }
        public string Location { get; set; }
        public string WorkType { get; set; }
        public DateTime ApplicationDeadline { get; set; } // Thêm trường ApplicationDeadline

        // Thông tin từ bảng Employer
        public string CompanyLogo { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string Industry { get; set; }
    }

    // DTO cho Create - có thêm validation attributes
    public class CreateJobPostingDto : JobPostingBaseDto
    {
        [Required(ErrorMessage = "Tiêu đề công việc là bắt buộc")]
        public new string JobTitle { get; set; }

        [Required(ErrorMessage = "Loại công việc là bắt buộc")]
        public new string WorkType { get; set; }

        [Required(ErrorMessage = "Tên công ty là bắt buộc")]
        public new string CompanyName { get; set; }

        [Required(ErrorMessage = "Thời hạn nộp hồ sơ là bắt buộc")]
        [DataType(DataType.DateTime)]
        [FutureDate(ErrorMessage = "Thời hạn nộp hồ sơ phải là ngày trong tương lai")]
        public new DateTime ApplicationDeadline { get; set; }

        // ID của Employer nếu đã tồn tại
        public int? EmployerId { get; set; }
    }

    // DTO cho Update - sẽ sử dụng sau khi thực hiện Create
    public class UpdateJobPostingDto : JobPostingBaseDto
    {
        public int JobPostingId { get; set; }

        [DataType(DataType.DateTime)]
        [FutureDate(ErrorMessage = "Thời hạn nộp hồ sơ phải là ngày trong tương lai")]
        public new DateTime ApplicationDeadline { get; set; }
    }

    // DTO cho thông tin trả về sau khi Create/Update/Get
    public class JobPostingResponseDto : JobPostingBaseDto
    {
        public int JobPostingId { get; set; }
        public int EmployerId { get; set; }
        public DateTime PostedAt { get; set; }
        public bool IsExpired => DateTime.UtcNow > ApplicationDeadline;
    }

    // Custom validation attribute để kiểm tra ngày trong tương lai
    public class FutureDateAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is DateTime dateTime)
            {
                if (dateTime <= DateTime.UtcNow)
                {
                    return new ValidationResult(ErrorMessage);
                }
            }

            return ValidationResult.Success;
        }
    }
}