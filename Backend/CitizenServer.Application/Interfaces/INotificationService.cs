using CitizenServer.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDTO>> GetAllNotificationsAsync(Guid userId);
        Task<NotificationDTO> GetNotificationByIdAsync(Guid id);
        Task<NotificationDTO> CreateNotificationAsync(NotificationDTO notification);
        Task<NotificationDTO> UpdateNotificationAsync(NotificationDTO notification);
        Task<bool> DeleteNotificationAsync(Guid id);
        Task<IEnumerable<NotificationDTO>> GetUnreadNotificationsAsync(Guid userId);
    }
}
