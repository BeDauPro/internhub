using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using InternHub.Attributes;

namespace InternHub.DTOs.Admin
{
    public class EmployerAccountCreateDto : IValidatableObject
    {
        [Required(ErrorMessage = "Username là bắt buộc")]
        [RegularExpression(@"^.*company$", ErrorMessage = "Username phải kết thúc bằng 'company'")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [StrongPassword(ErrorMessage = "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số và một ký tự đặc biệt.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; }

        // Validation tùy chỉnh
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {

            // Kiểm tra nếu username chứa dấu Enter (\r, \n, hoặc \r\n)
            if (UserName.Contains("\r") || UserName.Contains("\n"))
            {
                yield return new ValidationResult(
                    "Username không được chứa dấu Enter",
                    new[] { nameof(UserName) });
            }
        }
    }
}