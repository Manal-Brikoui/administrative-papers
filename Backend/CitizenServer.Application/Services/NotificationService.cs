using CitizenServer.Application.DTO;
using CitizenServer.Application.Interfaces;
using CitizenServer.Domain.Entities;
using CitizenServer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CitizenServer.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly CitizenServiceDbContext _context;

        public NotificationService(CitizenServiceDbContext context)
        {
            _context = context;
        }

        // Récupérer toutes les notifications d'un utilisateur
        public async Task<IEnumerable<NotificationDTO>> GetAllNotificationsAsync(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId)
                .ToListAsync();

            return notifications.Select(MapToDTO);
        }

        // Récupérer les notifications non lues d'un utilisateur
        public async Task<IEnumerable<NotificationDTO>> GetUnreadNotificationsAsync(Guid userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            return notifications.Select(MapToDTO);
        }

        // Récupérer une notification par ID
        public async Task<NotificationDTO> GetNotificationByIdAsync(Guid id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            return notification == null ? null : MapToDTO(notification);
        }

        // Créer une notification
        public async Task<NotificationDTO> CreateNotificationAsync(NotificationDTO dto)
        {
            if (dto == null) return null;

            var entity = new Notification
            {
                Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
                UserId = dto.UserId,
                Type = dto.Type,
                Message = dto.Message,
                NotificationDate = dto.NotificationDate == default ? DateTime.UtcNow : dto.NotificationDate,
                Status = dto.Status,
                Channel = dto.Channel,
                IsRead = dto.IsRead,
                RelatedEntityId = dto.RelatedEntityId,
                RelatedEntityType = dto.RelatedEntityType
            };

            _context.Notifications.Add(entity);
            await _context.SaveChangesAsync();

            return MapToDTO(entity);
        }

        // Mettre à jour une notification
        public async Task<NotificationDTO> UpdateNotificationAsync(NotificationDTO dto)
        {
            var entity = await _context.Notifications.FindAsync(dto.Id);
            if (entity == null) return null;

            entity.Type = dto.Type;
            entity.Message = dto.Message;
            entity.Status = dto.Status;
            entity.Channel = dto.Channel;
            entity.IsRead = dto.IsRead;
            entity.RelatedEntityId = dto.RelatedEntityId;
            entity.RelatedEntityType = dto.RelatedEntityType;

            await _context.SaveChangesAsync();
            return MapToDTO(entity);
        }

        // Supprimer une notification
        public async Task<bool> DeleteNotificationAsync(Guid id)
        {
            var entity = await _context.Notifications.FindAsync(id);
            if (entity == null) return false;

            _context.Notifications.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapping Entity -> DTO
        private static NotificationDTO MapToDTO(Notification entity)
        {
            return new NotificationDTO
            {
                Id = entity.Id,
                UserId = entity.UserId,
                Type = entity.Type,
                Message = entity.Message,
                NotificationDate = entity.NotificationDate,
                Status = entity.Status,
                Channel = entity.Channel,
                IsRead = entity.IsRead,
                RelatedEntityId = entity.RelatedEntityId,
                RelatedEntityType = entity.RelatedEntityType
            };
        }
    }
}
