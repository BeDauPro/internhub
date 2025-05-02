using AutoMapper;
using InternHub.DTOs.Review;
using InternHub.Models;
using InternHub.Models.Enums;
using InternHub.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace InternHub.Services
{
    public class StudentReviewService : IStudentReviewService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public StudentReviewService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<StudentReviewDto> CreateAsync(StudentReviewCreateDto dto)
        {
            if (dto.OverallRating < 1 || dto.OverallRating > 10)
                throw new ArgumentOutOfRangeException(nameof(dto.OverallRating), "OverallRating must be from 1 to 10.");

            // Kiểm tra đã review chưa
            var existed = await _context.StudentReviews
                .AnyAsync(r =>
                    r.StudentId == dto.StudentId &&
                    r.EmployerId == dto.EmployerId &&
                    r.ReviewerRole == dto.ReviewerRole);

            if (existed)
                throw new InvalidOperationException("Bạn đã đánh giá rồi.");

            // Kiểm tra điều kiện thực tập
            var application = await _context.Applications
                .Include(a => a.JobPosting)
                .FirstOrDefaultAsync(a =>
                    a.StudentId == dto.StudentId &&
                    a.JobPosting.EmployerId == dto.EmployerId);

            if (application == null)
                throw new InvalidOperationException("Không tìm thấy thông tin thực tập phù hợp.");

            if (dto.ReviewerRole == ReviewerRole.Employer)
                {
                    if (application.Status != "Completed")
                        throw new InvalidOperationException("Chỉ có thể đánh giá sinh viên sau khi hoàn thành thực tập.");
                }
                else if (dto.ReviewerRole == ReviewerRole.Student)
                {
                    if (application.Status != "Completed")
                        throw new InvalidOperationException("Bạn chưa hoàn thành thực tập tại công ty này.");
                }

            // Tạo review
            var review = _mapper.Map<StudentReview>(dto);
            review.ReviewedAt = DateTime.UtcNow;

            _context.StudentReviews.Add(review);
            await _context.SaveChangesAsync();

            return _mapper.Map<StudentReviewDto>(review);
        }


        public async Task<List<StudentReviewDto>> GetReviewsByStudentIdAsync(int studentId)
        {
            var reviews = await _context.StudentReviews
                .Include(r => r.Employer)
                .Include(r => r.Student)
                .Where(r => r.StudentId == studentId && r.ReviewerRole == ReviewerRole.Employer)
                .ToListAsync();

            return _mapper.Map<List<StudentReviewDto>>(reviews);
        }

        public async Task<List<StudentReviewDto>> GetReviewsByEmployerIdAsync(int employerId)
        {
            var reviews = await _context.StudentReviews
                .Include(r => r.Employer)
                .Include(r => r.Student)
                .Where(r => r.EmployerId == employerId && r.ReviewerRole == ReviewerRole.Student)
                .ToListAsync();

            return _mapper.Map<List<StudentReviewDto>>(reviews);
        }
    }
}
