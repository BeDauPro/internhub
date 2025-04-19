using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternHub.Migrations
{
    public partial class UpdateStudentReviewUniqueIndex : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentReviews_StudentId_EmployerId",
                table: "StudentReviews");

            migrationBuilder.CreateIndex(
                name: "IX_StudentReviews_StudentId_EmployerId_ReviewerRole",
                table: "StudentReviews",
                columns: new[] { "StudentId", "EmployerId", "ReviewerRole" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StudentReviews_StudentId_EmployerId_ReviewerRole",
                table: "StudentReviews");

            migrationBuilder.CreateIndex(
                name: "IX_StudentReviews_StudentId_EmployerId",
                table: "StudentReviews",
                columns: new[] { "StudentId", "EmployerId" },
                unique: true);
        }
    }
}
