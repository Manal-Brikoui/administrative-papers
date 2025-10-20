using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Domain.Entities
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }  // Identifiant unique de la notification
        public Guid UserId { get; set; }

        [Required]
        public string Type { get; set; }  // Type de notification

        [Required]
        public string Message { get; set; }  // Le message de la notification

        public DateTime NotificationDate { get; set; }  // Date et heure de la notification

        [Required]
        public string Status { get; set; }  // Statut de la notification


        [Required]
        public string Channel { get; set; }  // Canal de la notification

        public bool IsRead { get; set; }  // Indique si la notification a été lue ou non

        public Guid? RelatedEntityId { get; set; }  // Référence à l'entité liée à la notification

        [Required]
        public string RelatedEntityType { get; set; }  // Type de l'entité liée 

        public Notification()
        {
            NotificationDate = DateTime.UtcNow;  // Initialiser à l'heure actuelle au moment de la création
            IsRead = false;  // Par défaut, une notification est non lue
        }

        public Notification(Guid userId, string type, string message, DateTime notificationDate, string status, string channel, bool isRead, Guid? relatedEntityId, string relatedEntityType)
        {
            UserId = userId;
            Type = type;
            Message = message;
            NotificationDate = notificationDate;
            Status = status;
            Channel = channel;
            IsRead = isRead;
            RelatedEntityId = relatedEntityId;
            RelatedEntityType = relatedEntityType;
        }
    }
}
