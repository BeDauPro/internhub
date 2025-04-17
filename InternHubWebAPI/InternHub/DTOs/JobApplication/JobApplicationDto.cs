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
    }
}

