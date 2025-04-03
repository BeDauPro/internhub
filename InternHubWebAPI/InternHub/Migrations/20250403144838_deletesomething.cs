using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternHub.Migrations
{
    public partial class deletesomething : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetCode",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ResetCodeExpires",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordResetCode",
                table: "AspNetUsers",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetCodeExpires",
                table: "AspNetUsers",
                type: "datetime(6)",
                nullable: true);
        }
    }
}
