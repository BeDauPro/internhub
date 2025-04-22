using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using InternHub.Models.Enums;

namespace InternHub.DTOs.JobPosting
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
        public string WorkType { get; set; } // Để phù hợp với database và code hiện tại
        public DateTime ApplicationDeadline { get; set; }
    }

    // DTO cho Create - có thêm validation attributes
    public class CreateJobPostingDto : JobPostingBaseDto
    {
        // Validation
        [Required(ErrorMessage = "Tiêu đề công việc là bắt buộc")]
        public string JobTitle { get; set; }

        [Required(ErrorMessage = "Loại công việc là bắt buộc")]
        public string WorkType { get; set; }

        [Required(ErrorMessage = "Thời hạn nộp hồ sơ là bắt buộc")]
        [DataType(DataType.DateTime)]
        [FutureDate(ErrorMessage = "Thời hạn nộp hồ sơ phải là ngày trong tương lai")]
        public DateTime ApplicationDeadline { get; set; }
    }

    // DTO cho Update - chỉ cập nhật thông tin từ JobPosting
    public class UpdateJobPostingDto
    {
        // Thông tin từ bảng JobPosting có thể cập nhật
        public string? JobTitle { get; set; }
        public string? Salary { get; set; }
        public string? ExperienceRequired { get; set; }
        public string? JobDesc { get; set; }
        public string? SkillsRequired { get; set; }
        public string? LanguagesRequired { get; set; }
        public int Vacancies { get; set; }
        public string? JobCategory { get; set; }
        public string? Location { get; set; }
        public string WorkType { get; set; }

        [DataType(DataType.DateTime)]
        [FutureDate(ErrorMessage = "Thời hạn nộp hồ sơ phải là ngày trong tương lai")]
        public DateTime ApplicationDeadline { get; set; }
    }

    // DTO cho thông tin trả về danh sách (Hình 1)
    public class JobPostingListDto
    {
        public int JobPostingId { get; set; }
        public string JobTitle { get; set; }
        public string WorkType { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public string Location { get; set; }
        public int Vacancies { get; set; }
        public DateTime ApplicationDeadline { get; set; }
        public DateTime PostedAt { get; set; }
    }

    // DTO cho thông tin chi tiết (Hình 2)
    public class JobPostingDetailDto
    {
        public int JobPostingId { get; set; }
        public string JobTitle { get; set; }
        public string JobDesc { get; set; }
        public string JobCategory { get; set; }
        public string Location { get; set; }
        public string Salary { get; set; }
        public string WorkType { get; set; }
        public string ExperienceRequired { get; set; }
        public string SkillsRequired { get; set; }
        public string LanguagesRequired { get; set; }
        public int Vacancies { get; set; }
        public DateTime ApplicationDeadline { get; set; }
        public DateTime PostedAt { get; set; }

        // Thông tin từ bảng Employer
        public int EmployerId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public string Address { get; set; }
        public string Industry { get; set; }
    }

    // DTO cho thông tin trả về đầy đủ (dành cho Admin và Employer xem thông tin đầy đủ)
    public class JobPostingResponseDto
    {
        // Thông tin từ bảng JobPosting
        public int JobPostingId { get; set; }
        public string JobTitle { get; set; }
        public string JobDesc { get; set; }
        public string JobCategory { get; set; }
        public string Location { get; set; }
        public string Salary { get; set; }
        public string WorkType { get; set; }
        public string ExperienceRequired { get; set; }
        public string SkillsRequired { get; set; }
        public string LanguagesRequired { get; set; }
        public int Vacancies { get; set; }
        public DateTime ApplicationDeadline { get; set; }
        public DateTime PostedAt { get; set; }
        public JobpostingStatus? Status { get; set; }

        // Thông tin từ bảng Employer
        public int EmployerId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public string Address { get; set; }
        public string Industry { get; set; }

        // Thông tin bổ sung
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