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
            CreateMap<StudentReviewCreateDto, StudentReview>();
            CreateMap<StudentReview, StudentReviewDto>()
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.FullName))
                .ForMember(dest => dest.StudentAvatar, opt => opt.MapFrom(src => src.Student.ProfilePicture))
                .ForMember(dest => dest.EmployerName, opt => opt.MapFrom(src => src.Employer.CompanyName))
                .ForMember(dest => dest.EmployerLogo, opt => opt.MapFrom(src => src.Employer.CompanyLogo));
        }
    }

}

