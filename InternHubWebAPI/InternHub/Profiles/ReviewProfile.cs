using System;
using AutoMapper;
using InternHub.DTOs.Review;
using InternHub.Models;

namespace InternHub.Profiles
{
    public class ReviewProfile : Profile
    {
        public ReviewProfile()
        {
            CreateMap<StudentReview, StudentReviewDto>()
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.FullName))
                .ForMember(dest => dest.EmployerName, opt => opt.MapFrom(src => src.Employer.CompanyName));

            CreateMap<StudentReviewCreateDto, StudentReview>();
        }
    }

}

