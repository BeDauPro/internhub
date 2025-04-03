using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternHub.Migrations
{
    public partial class AddPasswordResetFieldsToApplicationUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordResetToken",
                table: "AspNetUsers",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetTokenExpires",
                table: "AspNetUsers",
                type: "datetime(6)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ResetTokenExpires",
                table: "AspNetUsers");
        }
    }
}
