using System;
using System.ComponentModel.DataAnnotations;
using InternHub.Models.ViewModels;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace InternHub.Models
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }
        public string FullName { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<Event> Events { get; set; }
        public virtual ICollection<Notification> Notifications { get; set; }
    }

}

