using CitizenServer.Application.DTO;
using CitizenServer.Domain.Entities;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CitizenServer.API.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize] 
    public class RendezvousController : ControllerBase
    {
        private readonly CitizenServiceDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public RendezvousController(CitizenServiceDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        // Créer un rendez-vous 
        [HttpPost]
        [Authorize(Roles = "citizen")]
        public async Task<IActionResult> AddRendezvous([FromBody] Rendezvous rendezvous)
        {
            if (rendezvous == null)
                return BadRequest("Les informations du rendez-vous sont invalides.");

            if (!_currentUser.IsAuthenticated || string.IsNullOrWhiteSpace(_currentUser.UserId))
                return Unauthorized("Utilisateur non authentifié.");

            var typeDossier = await _context.TypeDossiers.FindAsync(rendezvous.TypeDossierId);
            if (typeDossier == null)
                return BadRequest("Le type de dossier n'existe pas.");

            rendezvous.Id = Guid.NewGuid();
            rendezvous.UserId = Guid.Parse(_currentUser.UserId);
            rendezvous.Status = "en attente";

            _context.Rendezvous.Add(rendezvous);
            await _context.SaveChangesAsync();

            var dto = new RendezvousDTO
            {
                Id = rendezvous.Id,
                UserId = rendezvous.UserId,
                TypeDossierId = rendezvous.TypeDossierId,
                AppointmentDate = rendezvous.AppointmentDate,
                Status = rendezvous.Status
            };

            return CreatedAtAction(nameof(GetRendezvousById), new { id = rendezvous.Id }, dto);
        }

        // Valider ou refuser un rendez-vous 
        [HttpPut("{id}/validate")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> ValidateRendezvous(Guid id, [FromBody] string status)
        {
            // Vérification du statut
            status = status.ToLower();
            if (status != "validé" && status != "refusé")
                return BadRequest("Le statut doit être 'validé' ou 'refusé'.");

            var rendezvous = await _context.Rendezvous.FindAsync(id);
            if (rendezvous == null)
                return NotFound("Rendez-vous introuvable.");

            // Mise à jour du statut
            rendezvous.Status = status;
            _context.Rendezvous.Update(rendezvous);
            await _context.SaveChangesAsync();

            // Création d'une notification pour le citizen
            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                UserId = rendezvous.UserId,
                Type = "rendezvous",
                Message = $"Votre rendez-vous du {rendezvous.AppointmentDate:dd/MM/yyyy HH:mm} a été {status}.",
                NotificationDate = DateTime.UtcNow,
                Status = "non lu",
                Channel = "email",
                RelatedEntityId = rendezvous.Id,
                RelatedEntityType = "Rendezvous",
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Rendez-vous {status} et notification envoyée.", rendezvous });
        }

        // Récupérer un rendez-vous par ID
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetRendezvousById(Guid id)
        {
            var rendezvous = await _context.Rendezvous
                .Include(r => r.TypeDossier)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (rendezvous == null)
                return NotFound("Rendez-vous introuvable.");

            // Si citizen, il ne peut voir que ses propres rendez-vous
            if (!_currentUser.IsInRole("admin") && rendezvous.UserId.ToString() != _currentUser.UserId)
                return Forbid("Accès refusé.");

            var dto = new RendezvousDTO
            {
                Id = rendezvous.Id,
                UserId = rendezvous.UserId,
                TypeDossierId = rendezvous.TypeDossierId,
                AppointmentDate = rendezvous.AppointmentDate,
                Status = rendezvous.Status
            };

            return Ok(dto);
        }

        // Récupérer tous les rendez-vous 
        [HttpGet]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetAllRendezvous()
        {
            var rendezvousList = await _context.Rendezvous
                .Include(r => r.TypeDossier)
                .Select(r => new RendezvousDTO
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    TypeDossierId = r.TypeDossierId,
                    AppointmentDate = r.AppointmentDate,
                    Status = r.Status
                })
                .ToListAsync();

            return Ok(rendezvousList);
        }

        // Supprimer un rendez-vous
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> DeleteRendezvous(Guid id)
        {
            var rendezvous = await _context.Rendezvous.FindAsync(id);
            if (rendezvous == null)
                return NotFound("Rendez-vous introuvable.");

            // Citizen ne peut supprimer que son propre rendez-vous
            if (_currentUser.IsInRole("citizen") && rendezvous.UserId.ToString() != _currentUser.UserId)
                return Forbid("Vous n'êtes pas autorisé à supprimer ce rendez-vous.");

            _context.Rendezvous.Remove(rendezvous);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
