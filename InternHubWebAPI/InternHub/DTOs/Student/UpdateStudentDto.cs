using InternHub.Models.Enums;

namespace InternHub.DTOs.Student
{
    public class UpdateStudentDto : CreateStudentDto
    {
        public StudentStatus? Status { get; set; }
    }
}
