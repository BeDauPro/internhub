using System;
using InternHub.DTOs.Review;

namespace InternHub.Services.Interfaces
{
	public interface IStudentReviewService
	{
        Task<StudentReviewDto> CreateAsync(StudentReviewCreateDto dto);
        Task<List<StudentReviewDto>> GetReviewsByStudentIdAsync(int studentId);
    }
}


