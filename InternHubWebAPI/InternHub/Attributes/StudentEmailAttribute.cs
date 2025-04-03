using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace InternHub.Attributes
{
    public class StudentEmailAttribute : ValidationAttribute
    {
        private const string EmailPattern = @"^\d{2}t\d{7}@husc\.edu\.vn$";

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return new ValidationResult("Email không được để trống.");
            }

            if (!Regex.IsMatch(value.ToString(), EmailPattern))
            {
                return new ValidationResult("Email phải có định dạng: [2 số]t[7 số]@husc.edu.vn.");
            }

            return ValidationResult.Success;
        }
    }
}

