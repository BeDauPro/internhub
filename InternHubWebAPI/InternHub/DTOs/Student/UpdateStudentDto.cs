using InternHub.Models.Enums;

namespace InternHub.DTOs.Student
{
    public class UpdateStudentDto
    {
        public string? FullName { get; set; }
        public string? SchoolEmail { get; set; }
        public string? Bio { get; set; }
        public string? Address { get; set; }
        public string? GithubProfile { get; set; }
        public string? Gender { get; set; }
        public string? Skills { get; set; }
        public string? Languages { get; set; }
        public string? UserId { get; set; }
        public decimal? GPA { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfilePicture { get; set; }
        public string? ProfilePicture2 { get; set; }
        public IFormFile? CVFile { get; set; }
        public string? Education { get; set; }
        public string? Phone { get; set; }

        public bool HasNonStatusFields()
        {
            return !string.IsNullOrWhiteSpace(FullName)
                || !string.IsNullOrWhiteSpace(SchoolEmail)
                || !string.IsNullOrWhiteSpace(Bio)
                || !string.IsNullOrWhiteSpace(Address)
                || !string.IsNullOrWhiteSpace(GithubProfile)
                || !string.IsNullOrWhiteSpace(Gender)
                || !string.IsNullOrWhiteSpace(Skills)
                || !string.IsNullOrWhiteSpace(Languages)
                || !string.IsNullOrWhiteSpace(UserId)
                || !string.IsNullOrWhiteSpace(Education)
                || !string.IsNullOrWhiteSpace(Phone)
                || GPA.HasValue
                || DateOfBirth.HasValue
                || ProfilePicture != null
                || CVFile != null;
        }
    }
}
