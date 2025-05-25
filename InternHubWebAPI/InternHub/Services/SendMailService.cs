using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using InternHub.Contacts;

namespace InternHub.Services
{
    public class SendGridMailService : IEmailSender
    {
        private readonly IConfiguration _config;
        private readonly ILogger<SendGridMailService> _logger;

        public SendGridMailService(IConfiguration config, ILogger<SendGridMailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var apiKey = _config["SendGrid:ApiKey"];
            var client = new SendGridClient(apiKey);

            var from = new EmailAddress(_config["SendGrid:SenderEmail"], _config["SendGrid:SenderName"]);
            var to = new EmailAddress(email);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, null, htmlMessage);

            var response = await client.SendEmailAsync(msg);

            if (response.IsSuccessStatusCode)
            {
                SaveEmailLog(email, subject, htmlMessage, "logs/emails/sent");
            }
            else
            {
                SaveEmailLog(email, subject, htmlMessage, "logs/emails/failed");
                _logger.LogError($"SendGrid failed: {response.StatusCode}");
            }
        }

        private void SaveEmailLog(string to, string subject, string body, string folderPath)
        {
            Directory.CreateDirectory(folderPath);
            var filePath = $"{folderPath}/{Guid.NewGuid()}.txt";
            File.WriteAllText(filePath, $"To: {to}\nSubject: {subject}\nBody:\n{body}");
        }
    }
}