using CitizenServer.Domain.Entities;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CitizenService.API.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize]
    public class DossierAdministratifController : ControllerBase
    {
        private readonly CitizenServiceDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DossierAdministratifController(CitizenServiceDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        
        [HttpGet]
        [Authorize(Roles = "citizen,admin")]
        public async Task<IActionResult> GetDossiers()
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            var userId = Guid.Parse(_currentUser.UserId!);

            var dossiers = await _context.Dossiers
                .Where(d => d.UserId == userId || _currentUser.IsInRole("admin"))
                .Select(d => new
                {
                    d.Id,
                    d.UserId,
                    d.TypeDossierId,
                    d.Status,
                    d.SubmissionDate,
                    d.ValidationDate,
                    d.IsCompleted
                })
                .ToListAsync();

            return Ok(dossiers);
        }

        
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetDossierById(Guid id)
        {
            var dossier = await _context.Dossiers.FindAsync(id);
            if (dossier == null)
                return NotFound("Dossier introuvable.");

            return Ok(new
            {
                dossier.Id,
                dossier.UserId,
                dossier.TypeDossierId,
                dossier.Status,
                dossier.SubmissionDate,
                dossier.ValidationDate,
                dossier.IsCompleted
            });
        }

        // ajouter un dossier 
        [HttpPost]
        [Authorize(Roles = "citizen")]
        public async Task<IActionResult> AddDossier([FromBody] DossierAdministratif dossier)
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            if (dossier == null || dossier.TypeDossierId == Guid.Empty)
                return BadRequest("TypeDossierId est obligatoire.");

            dossier.Id = Guid.NewGuid();
            dossier.UserId = Guid.Parse(_currentUser.UserId!);
            dossier.SubmissionDate = DateTime.UtcNow;
            dossier.IsCompleted = false;

            try
            {
                await _context.Dossiers.AddAsync(dossier);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDossierById), new { id = dossier.Id }, new
                {
                    dossier.Id,
                    dossier.UserId,
                    dossier.TypeDossierId,
                    dossier.Status,
                    dossier.SubmissionDate,
                    dossier.ValidationDate,
                    dossier.IsCompleted
                });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new
                {
                    error = "Erreur lors de l'enregistrement du dossier.",
                    details = dbEx.InnerException?.Message ?? dbEx.Message
                });
            }
        }

        // supprime un dossier
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> DeleteDossier(Guid id)
        {
            var dossier = await _context.Dossiers.FindAsync(id);
            if (dossier == null)
                return NotFound("Dossier introuvable.");

            // Supprimer d'abord les documents associés
            var documents = _context.Documents.Where(d => d.DossierAdministratifId == id);
            _context.Documents.RemoveRange(documents);

            _context.Dossiers.Remove(dossier);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //  mettre à jour un dossier 
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateDossier(Guid id, [FromBody] DossierAdministratif updatedDossier)
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            var dossier = await _context.Dossiers.FindAsync(id);
            if (dossier == null)
                return NotFound("Dossier introuvable.");

            // Mettre à jour les champs autorisés
            dossier.Status = updatedDossier.Status ?? dossier.Status;
            dossier.ValidationDate = updatedDossier.ValidationDate ?? dossier.ValidationDate;
            dossier.IsCompleted = updatedDossier.IsCompleted;

            try
            {
                _context.Dossiers.Update(dossier);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    dossier.Id,
                    dossier.UserId,
                    dossier.TypeDossierId,
                    dossier.Status,
                    dossier.SubmissionDate,
                    dossier.ValidationDate,
                    dossier.IsCompleted
                });
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new
                {
                    error = "Erreur lors de la mise à jour du dossier.",
                    details = dbEx.InnerException?.Message ?? dbEx.Message
                });
            }
        }

        // ajouter document à un dossier
        [HttpPost("{dossierId}/documents")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> AddDocument(Guid dossierId, [FromBody] Document document)
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            if (document == null || string.IsNullOrWhiteSpace(document.Type) || string.IsNullOrWhiteSpace(document.FilePath))
                return BadRequest("Type et FilePath sont obligatoires.");

            var dossier = await _context.Dossiers.FindAsync(dossierId);
            if (dossier == null)
                return NotFound("Dossier introuvable.");

            document.Id = Guid.NewGuid();
            document.DossierAdministratifId = dossierId;
            document.UserId = Guid.Parse(_currentUser.UserId!);
            document.UploadDate = DateTime.UtcNow;

            await _context.Documents.AddAsync(document);
            await _context.SaveChangesAsync();

            // Retourner un DTO pour éviter le cycle JSON
            var result = new
            {
                document.Id,
                document.UserId,
                document.DossierAdministratifId,
                document.Type,
                document.FilePath,
                document.UploadDate,
                document.IsOnPlatform,
                document.ImportLocation
            };

            return CreatedAtAction(nameof(GetDossierById), new { id = dossierId }, result);
        }
    }
}
