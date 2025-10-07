using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Infrastructure.Services;
using CitizenServer.Domain.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace CitizenServer.API.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize] // Authentification obligatoire
    public class DocumentController : ControllerBase
    {
        private readonly CitizenServiceDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DocumentController(CitizenServiceDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        // === Récupérer tous les documents ===
        [HttpGet]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetDocuments()
        {
            if (!_currentUser.IsAuthenticated || string.IsNullOrWhiteSpace(_currentUser.UserId))
                return Unauthorized("Utilisateur non authentifié.");

            var query = _context.Documents.AsQueryable();

            if (!_currentUser.IsInRole("admin"))
            {
                if (!Guid.TryParse(_currentUser.UserId, out var userId))
                    return BadRequest("UserId invalide.");

                query = query.Where(d => d.UserId == userId);
            }

            var documents = await query.ToListAsync();
            return Ok(documents); // Toujours un tableau, même vide
        }

        // === Récupérer un document par ID ===
        [HttpGet("{documentId:guid}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetDocumentById(Guid documentId)
        {
            var document = await _context.Documents.FindAsync(documentId);
            if (document == null)
                return NotFound("Le document n'a pas été trouvé.");

            if (!_currentUser.IsInRole("admin") && document.UserId.ToString() != _currentUser.UserId)
                return Forbid("Accès interdit à ce document.");

            return Ok(document);
        }

        // === Ajouter un document ===
        [HttpPost]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> AddDocument([FromBody] Document document)
        {
            if (!_currentUser.IsAuthenticated || string.IsNullOrWhiteSpace(_currentUser.UserId))
                return Unauthorized("Utilisateur non authentifié.");

            if (document == null)
                return BadRequest("Les informations du document sont invalides.");

            if (!_currentUser.IsInRole("admin"))
            {
                if (!Guid.TryParse(_currentUser.UserId, out var userId))
                    return BadRequest("UserId invalide.");

                document.UserId = userId;
                document.ImportLocation = null;    // citizen ne décide pas de l’emplacement
                document.IsOnPlatform = false;     // citizen ne peut pas mettre sur plateforme
            }

            document.Id = Guid.NewGuid();
            document.UploadDate = DateTime.UtcNow;

            await _context.Documents.AddAsync(document);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDocumentById), new { documentId = document.Id }, document);
        }

        // === Mettre à jour un document ===
        [HttpPut("{documentId:guid}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> UpdateDocument(Guid documentId, [FromBody] Document updatedDocument)
        {
            if (updatedDocument == null || documentId != updatedDocument.Id)
                return BadRequest("Données invalides.");

            var document = await _context.Documents.FindAsync(documentId);
            if (document == null)
                return NotFound("Le document n'a pas été trouvé.");

            if (!_currentUser.IsInRole("admin") && document.UserId.ToString() != _currentUser.UserId)
                return Forbid("Accès interdit à ce document.");

            // Mise à jour des champs autorisés pour tous
            document.Type = updatedDocument.Type;
            document.FilePath = updatedDocument.FilePath;

            // Seul l’admin peut changer ces champs
            if (_currentUser.IsInRole("admin"))
            {
                document.ImportLocation = updatedDocument.ImportLocation;
                document.IsOnPlatform = updatedDocument.IsOnPlatform;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // === Supprimer un document ===
        [HttpDelete("{documentId:guid}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> DeleteDocument(Guid documentId)
        {
            var document = await _context.Documents.FindAsync(documentId);
            if (document == null)
                return NotFound("Le document n'a pas été trouvé.");

            if (!_currentUser.IsInRole("admin") && document.UserId.ToString() != _currentUser.UserId)
                return Forbid("Accès interdit à ce document.");

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
