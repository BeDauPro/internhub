using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace InternHub.Attributes
{
    public class StrongPasswordAttribute : ValidationAttribute
    {
        private const string PasswordPattern = @"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return new ValidationResult("Mật khẩu không được để trống.");
            }

            if (!Regex.IsMatch(value.ToString(), PasswordPattern))
            {
                return new ValidationResult("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
            }

            return ValidationResult.Success;
        }
    }
}

