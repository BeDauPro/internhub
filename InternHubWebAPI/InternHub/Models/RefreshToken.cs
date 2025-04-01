using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternHub.Models
{
	public class RefreshToken
	{
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Token { get; set; }
        public string JwtId { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime DateExpire { get; set; }
        [ForeignKey("UserId")]

        public ApplicationUser User { get; set; }
    }
}

