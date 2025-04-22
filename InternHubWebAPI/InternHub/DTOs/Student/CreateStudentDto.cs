namespace InternHub.DTOs.Student
{
    public class CreateStudentDto
    {
        public string? FullName { get; set; }
        public string? SchoolEmail { get; set; }
        public string? ProfilePicture { get; set; }
        public string? ProfilePicture2 { get; set; }
        public IFormFile? CVFile { get; set; }
        public string? Address { get; set; }
        public string? Bio { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public decimal? GPA { get; set; }
        public string? Skills { get; set; }
        public string? Languages { get; set; }
        public string? GithubProfile { get; set; }
        public string? Education { get; set; }
        public string? Phone { get; set; }
    }
}
