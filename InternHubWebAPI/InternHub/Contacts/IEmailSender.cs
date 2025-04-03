using System;
namespace InternHub.Contacts
{
	public interface IEmailSender
	{
        Task SendEmailAsync(string email, string subject, string message);
    }
}

