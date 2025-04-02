using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InternHub.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Student> Students { get; set; }
        public DbSet<Employer> Employers { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<JobPosting> JobPostings { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<ApplicationHistory> ApplicationHistories { get; set; }
        public DbSet<StudentReview> StudentReviews { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Định nghĩa bảng
            modelBuilder.Entity<Student>().ToTable("Students");
            modelBuilder.Entity<Employer>().ToTable("Employers");
            modelBuilder.Entity<Admin>().ToTable("Admins");
            modelBuilder.Entity<Event>().ToTable("Events");
            modelBuilder.Entity<JobPosting>().ToTable("JobPostings");
            modelBuilder.Entity<Application>().ToTable("Applications");
            modelBuilder.Entity<ApplicationHistory>().ToTable("ApplicationHistories");
            modelBuilder.Entity<StudentReview>().ToTable("StudentReviews");
            modelBuilder.Entity<Notification>().ToTable("Notifications");

            modelBuilder.Entity<Event>()
             .HasOne(e => e.Admin)
             .WithMany(a => a.Events)
             .HasForeignKey(e => e.CreatedByAdminId)
             .OnDelete(DeleteBehavior.Restrict);
            // Cấu hình Unique: Một Student chỉ được review một Employer
            modelBuilder.Entity<StudentReview>()
                .HasIndex(sr => new { sr.StudentId, sr.EmployerId })
                .IsUnique();

            // Cấu hình mối quan hệ giữa ApplicationHistory và Student
            modelBuilder.Entity<ApplicationHistory>()
                .HasOne(a => a.Student)
                .WithMany(s => s.ApplicationHistories)
                .HasForeignKey(a => a.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình mối quan hệ giữa ApplicationHistory và Employer
            modelBuilder.Entity<ApplicationHistory>()
                .HasOne(a => a.Employer)
                .WithMany()
                .HasForeignKey(a => a.EmployerId)
                .OnDelete(DeleteBehavior.Restrict);

        // Mối quan hệ giữa Application và JobPosting
            modelBuilder.Entity<Application>()
                .HasOne(a => a.JobPosting)
                .WithMany(jp => jp.Applications)
                .HasForeignKey(a => a.JobPostingId)
                .OnDelete(DeleteBehavior.Restrict); // Không xóa ứng tuyển khi xóa công việc

            // Cấu hình bảng
            modelBuilder.Entity<ApplicationHistory>().ToTable("ApplicationHistories");

            // Nếu Student đã có trạng thái "internship", các Employer khác không thể chỉnh sửa
            modelBuilder.Entity<Student>()
                .HasQueryFilter(s => s.Status != "internship");

            // Notification chỉ được gửi bởi Admin và chỉ dành cho Student
            modelBuilder.Entity<Notification>()
                 .HasOne(n => n.Student)
                 .WithMany(s => s.Notifications)
                 .HasForeignKey(n => n.StudentId)
                 .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Admin)
                .WithMany(a => a.Notifications)
                .HasForeignKey(n => n.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            // Thiết lập khóa chính cho IdentityUserLogin
            modelBuilder.Entity<IdentityUserLogin<string>>().HasKey(x => new { x.LoginProvider, x.ProviderKey });

            // Cấu hình mối quan hệ giữa RefreshToken và ApplicationUser
            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany()
                .HasForeignKey(rt => rt.UserId);
        }
    }
}
