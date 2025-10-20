using CitizenServer.Domain.Entities;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CitizenServer.API.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize] 
    public class NotificationController : ControllerBase
    {
        private readonly CitizenServiceDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public NotificationController(CitizenServiceDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        // Récupérer toutes les notifications
        
        [HttpGet]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetNotifications()
        {
            if (!_currentUser.IsAuthenticated || string.IsNullOrWhiteSpace(_currentUser.UserId))
                return Unauthorized("Utilisateur non authentifié.");

            var isAdmin = _currentUser.IsInRole("admin");
            Guid.TryParse(_currentUser.UserId, out var userId);

            // Admin voit toutes les notifications des citoyens, citizen uniquement les siennes
            var notifications = await _context.Notifications
                .Where(n => isAdmin || n.UserId == userId)
                .OrderByDescending(n => n.NotificationDate)
                .ToListAsync();

            var notificationsWithMessage = notifications.Select(n =>
            {
                if (isAdmin)
                {
                    // Admin voit le message d'origine ou message générique si vide
                    n.Message = string.IsNullOrWhiteSpace(n.Message)
                        ? $"Notification du citoyen {n.UserId} : vérifiez le rendez-vous."
                        : n.Message;
                }
                else
                {
                    n.Message = n.Status switch
                    {
                        "Accepted" => "Votre rendez-vous a été accepté ✅",
                        "Refused" => "Votre rendez-vous a été refusé ❌",
                        _ => "Votre demande de rendez-vous est en cours de traitement ⏳"
                    };
                }
                return n;
            }).ToList();

            return Ok(notificationsWithMessage);
        }

        // Récupérer une notification par ID
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetNotificationById(Guid id)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id);
            if (notification == null)
                return NotFound("Notification non trouvée.");

            var isAdmin = _currentUser.IsInRole("admin");

            if (!isAdmin && notification.UserId.ToString() != _currentUser.UserId)
                return Forbid("Accès interdit à cette notification.");

            if (isAdmin)
            {
                notification.Message = string.IsNullOrWhiteSpace(notification.Message)
                    ? "Un citoyen a pris un rendez-vous. Veuillez vérifier."
                    : notification.Message;
            }
            else
            {
                notification.Message = notification.Status switch
                {
                    "Accepted" => "Votre rendez-vous a été accepté ✅",
                    "Refused" => "Votre rendez-vous a été refusé ❌",
                    _ => "Votre demande de rendez-vous est en cours de traitement ⏳"
                };
            }

            return Ok(notification);
        }

        //Créer une notification 
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateNotification([FromBody] Notification notification)
        {
            if (notification == null)
                return BadRequest("Les informations de la notification sont invalides.");

            notification.Id = Guid.NewGuid();
            notification.NotificationDate = DateTime.UtcNow;

            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNotificationById), new { id = notification.Id }, notification);
        }

        //  Mettre à jour une notification
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateNotification(Guid id, [FromBody] Notification updatedNotification)
        {
            if (updatedNotification == null || id != updatedNotification.Id)
                return BadRequest("Données invalides.");

            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return NotFound("Notification introuvable.");

            notification.Message = updatedNotification.Message;
            notification.Status = updatedNotification.Status;
            notification.IsRead = updatedNotification.IsRead;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Supprimer une notification
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> DeleteNotification(Guid id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification == null)
                return NotFound("Notification introuvable.");

            var isAdmin = _currentUser.IsInRole("admin");
            if (!isAdmin && notification.UserId.ToString() != _currentUser.UserId)
                return Forbid("Accès interdit à cette notification.");

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
