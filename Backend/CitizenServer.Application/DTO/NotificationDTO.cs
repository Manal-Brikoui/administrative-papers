using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.DTO
{
    public class NotificationDTO
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime NotificationDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Channel { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public Guid? RelatedEntityId { get; set; }
        public string RelatedEntityType { get; set; }
    }
}
