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

            modelBuilder.Entity<Student>().ToTable("Students");
            modelBuilder.Entity<Employer>().ToTable("Employers");
            modelBuilder.Entity<Admin>().ToTable("Admins");

            modelBuilder.Entity<Event>().ToTable("Events");
            modelBuilder.Entity<JobPosting>().ToTable("JobPostings");
            modelBuilder.Entity<Application>().ToTable("Applications");
            modelBuilder.Entity<ApplicationHistory>().ToTable("ApplicationHistories");
            modelBuilder.Entity<StudentReview>().ToTable("StudentReviews");
            modelBuilder.Entity<Notification>().ToTable("Notifications");

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
