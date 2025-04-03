using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using InternHub.Contacts;
using MailKit.Security;

namespace InternHub.Services
{
    public class MailSettings
    {
        public string Mail { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
    }

    public class SendMailService : IEmailSender
    {
        private readonly MailSettings _mailSettings;
        private readonly ILogger<SendMailService> _logger;

        public SendMailService(IOptions<MailSettings> mailSettings, ILogger<SendMailService> logger)
        {
            _mailSettings = mailSettings.Value;
            _logger = logger;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var message = new MimeMessage();
            message.Sender = new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail);
            message.From.Add(new MailboxAddress(_mailSettings.DisplayName, _mailSettings.Mail));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = htmlMessage };
            message.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();

            try
            {
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(message);

                // **Lưu lại email đã gửi thành công**
                SaveEmailToFile(message, "logs/emails/sent");
            }
            catch (Exception ex)
            {
                // **Lưu lại email lỗi**
                SaveEmailToFile(message, "logs/emails/failed");

                _logger.LogError($"Lỗi gửi mail: {ex.Message}");
            }

            smtp.Disconnect(true);
            _logger.LogInformation($"Email đã gửi đến: {email}");
        }

        private void SaveEmailToFile(MimeMessage message, string folderPath)
        {
            System.IO.Directory.CreateDirectory(folderPath);
            var emailSaveFile = $"{folderPath}/{Guid.NewGuid()}.eml";
            using var fileStream = System.IO.File.Create(emailSaveFile);
            message.WriteTo(fileStream);
        }

    }
}
