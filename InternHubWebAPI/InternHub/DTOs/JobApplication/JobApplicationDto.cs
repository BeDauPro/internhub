namespace InternHub.DTOs.JobApplication
{
    public class JobApplicationDto
    {
        public class ApplicationCreateDto
        {
            public int JobPostingId { get; set; }
        }

        public class ApplicationViewDto
        {
            public int ApplicationId { get; set; }
            public int StudentId { get; set; }
            public string StudentName { get; set; }
            public string StudentEmail { get; set; }
            public DateTime ApplicationDate { get; set; }
            public string Status { get; set; }
        }

        public class ApplicationHistoryDto
        {
            public int JobPostingId { get; set; }
            public string JobTitle { get; set; }
            public string CompanyName { get; set; }
            public DateTime ApplicationDate { get; set; }
            public string Status { get; set; }
        }

        // New DTO for admin view of applications
        public class StudentViewDto
        {
            public int StudentId { get; set; }
            public decimal GPA { get; set; }
            public string StudentName { get; set; }
            public string Status { get; set; }
            public string CVFile { get; set; }
            // Thêm các trường khác bạn muốn hiển thị
        }

        // New DTO for employer view of candidates
        public class EmployerCandidateViewDto
        {
            public int ApplicationId { get; set; }
            public string JobTitle { get; set; }
            public string StudentName { get; set; }
            //public string CVFile { get; set; }
            public DateTime ApplicationDate { get; set; }
            public string Status { get; set; }
            public int StudentId { get; set; }
        }
    }
}