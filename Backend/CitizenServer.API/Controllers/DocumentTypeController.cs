using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CitizenServer.Infrastructure.Data;
using CitizenServer.Domain.Entities;
using CitizenServer.Infrastructure.Services;
using System;
using System.Threading.Tasks;

namespace CitizenServer.API.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    [Authorize] 
    public class DocumentTypeController : ControllerBase
    {
        private readonly CitizenServiceDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public DocumentTypeController(CitizenServiceDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        // Récupérer tous les types de documents
        [HttpGet]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetDocumentTypes()
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            if (!_currentUser.IsInRole("Admin") && !_currentUser.IsInRole("Citizen"))
                return Forbid("Accès refusé.");

            var documentTypes = await _context.DocumentTypes
                .Include(dt => dt.CategoryEntity)
                .Include(dt => dt.TypeDossierEntity)
                .ToListAsync();

            return Ok(documentTypes);
        }

        // Récupérer un type de document par ID 
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetDocumentTypeById(Guid id)
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            if (!_currentUser.IsInRole("Admin") && !_currentUser.IsInRole("Citizen"))
                return Forbid("Accès refusé.");

            var documentType = await _context.DocumentTypes
                .Include(dt => dt.CategoryEntity)
                .Include(dt => dt.TypeDossierEntity)
                .FirstOrDefaultAsync(dt => dt.Id == id);

            if (documentType == null)
                return NotFound(new { message = "Le type de document n'a pas été trouvé." });

            return Ok(documentType);
        }

        // Ajouter un type de document
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddDocumentType([FromBody] DocumentType documentType)
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            if (!_currentUser.IsInRole("Admin"))
                return Forbid("Seul l'Admin peut ajouter un type de document.");

            if (documentType == null)
                return BadRequest("Les informations du type de document sont invalides.");

            var category = await _context.Categories.FindAsync(documentType.CategoryId);
            var typeDossier = await _context.TypeDossiers.FindAsync(documentType.TypeDossierId);

            if (category == null || typeDossier == null)
                return BadRequest("La catégorie ou le type de dossier n'existe pas.");

            documentType.Id = Guid.NewGuid();

            _context.DocumentTypes.Add(documentType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDocumentTypeById), new { id = documentType.Id }, documentType);
        }

        //  Mettre à jour un type de document
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateDocumentType(Guid id, [FromBody] DocumentType updatedDocumentType)
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            if (!_currentUser.IsInRole("Admin"))
                return Forbid("Seul l'Admin peut modifier un type de document.");

            if (updatedDocumentType == null || id != updatedDocumentType.Id)
                return BadRequest("Données invalides.");

            var documentType = await _context.DocumentTypes.FindAsync(id);
            if (documentType == null)
                return NotFound(new { message = "Le type de document n'a pas été trouvé." });

            documentType.Name = updatedDocumentType.Name;
            documentType.IsImportable = updatedDocumentType.IsImportable;
            documentType.CategoryId = updatedDocumentType.CategoryId;
            documentType.TypeDossierId = updatedDocumentType.TypeDossierId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        //  Supprimer un type de document
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteDocumentType(Guid id)
        {
            if (!_currentUser.IsAuthenticated)
                return Unauthorized("Utilisateur non authentifié.");

            if (!_currentUser.IsInRole("Admin"))
                return Forbid("Seul l'Admin peut supprimer un type de document.");

            var documentType = await _context.DocumentTypes.FindAsync(id);
            if (documentType == null)
                return NotFound(new { message = "Le type de document n'a pas été trouvé." });

            _context.DocumentTypes.Remove(documentType);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
