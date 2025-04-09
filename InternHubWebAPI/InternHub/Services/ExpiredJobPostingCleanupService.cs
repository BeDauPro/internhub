using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using InternHub.Models;

namespace InternHub.Services
{
    public class ExpiredJobPostingCleanupService : BackgroundService
    {
        private readonly ILogger<ExpiredJobPostingCleanupService> _logger;
        private readonly IServiceProvider _serviceProvider;

        // Khoảng thời gian chạy service (ví dụ: mỗi 12 giờ)
        private readonly TimeSpan _period = TimeSpan.FromHours(12);

        public ExpiredJobPostingCleanupService(
            ILogger<ExpiredJobPostingCleanupService> logger,
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using var timer = new PeriodicTimer(_period);

            do
            {
                _logger.LogInformation("Đang chạy dịch vụ dọn dẹp bài đăng hết hạn: {time}", DateTimeOffset.Now);

                try
                {
                    await CleanupExpiredJobPostings();
                    _logger.LogInformation("Hoàn thành dọn dẹp bài đăng hết hạn: {time}", DateTimeOffset.Now);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Lỗi khi dọn dẹp bài đăng hết hạn");
                }
            }
            while (await timer.WaitForNextTickAsync(stoppingToken) && !stoppingToken.IsCancellationRequested);
        }

        private async Task CleanupExpiredJobPostings()
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var now = DateTime.UtcNow;
            var expiredJobs = await dbContext.JobPostings
                .Where(j => j.ApplicationDeadline <= now)
                .ToListAsync();

            if (expiredJobs.Any())
            {
                _logger.LogInformation("Xóa {count} bài đăng đã hết hạn", expiredJobs.Count);
                dbContext.JobPostings.RemoveRange(expiredJobs);
                await dbContext.SaveChangesAsync();
            }
            else
            {
                _logger.LogInformation("Không có bài đăng hết hạn cần xóa");
            }
        }
    }
}