using System;
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
                throw new ArgumentOutOfRangeException("OverallRating must be from 1 to 10.");

            var validApplication = await _context.Applications
                .Include(a => a.JobPosting)
                .FirstOrDefaultAsync(a =>
                    a.StudentId == dto.StudentId &&
                    a.JobPosting.EmployerId == dto.EmployerId &&
                    a.Status == "Internship" || a.Status == "Completed");

            if (validApplication == null)
                throw new InvalidOperationException("Sinh viên chưa từng thực tập tại công ty bạn hoặc chưa hoàn thành thực tập.");

            var existed = await _context.StudentReviews
                .AnyAsync(r => r.StudentId == dto.StudentId && r.EmployerId == dto.EmployerId);

            if (existed)
                throw new InvalidOperationException("Bạn đã đánh giá sinh viên này rồi.");

            var review = _mapper.Map<StudentReview>(dto);
            _context.StudentReviews.Add(review);
            await _context.SaveChangesAsync();

            return _mapper.Map<StudentReviewDto>(review);
        }

        public async Task<List<StudentReviewDto>> GetReviewsByStudentIdAsync(int studentId)
        {
            var reviews = await _context.StudentReviews
                .Include(r => r.Employer)
                .Include(r => r.Student)
                .Where(r => r.StudentId == studentId)
                .ToListAsync();

            return _mapper.Map<List<StudentReviewDto>>(reviews);
        }
    }
}

