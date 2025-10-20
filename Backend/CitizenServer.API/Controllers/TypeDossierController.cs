using CitizenServer.Domain.Entities;
using CitizenServer.Infrastructure.Data;
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
    public class TypeDossierController : ControllerBase
    {
        private readonly CitizenServiceDbContext _context;

        public TypeDossierController(CitizenServiceDbContext context)
        {
            _context = context;
        }

        // tous les types de dossiers 
        [HttpGet]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetTypeDossiers()
        {
            var typeDossiers = await _context.TypeDossiers
                .Select(td => new
                {
                    td.Id,
                    td.Name,
                    td.Description
                })
                .ToListAsync();

            return Ok(typeDossiers);
        }

        //  type de dossier par Id
        [HttpGet("{id}")]
        [Authorize(Roles = "admin,citizen")]
        public async Task<IActionResult> GetTypeDossierById(Guid id)
        {
            var typeDossier = await _context.TypeDossiers
                .Where(td => td.Id == id)
                .Select(td => new
                {
                    td.Id,
                    td.Name,
                    td.Description
                })
                .FirstOrDefaultAsync();

            if (typeDossier == null)
                return NotFound(new { message = "Le type de dossier n'a pas été trouvé." });

            return Ok(typeDossier);
        }

        //  créer un type de dossier 
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> AddTypeDossier([FromBody] TypeDossier typeDossier)
        {
            if (typeDossier == null || string.IsNullOrWhiteSpace(typeDossier.Name))
                return BadRequest(new { message = "Les informations du type de dossier sont invalides." });

            typeDossier.Id = Guid.NewGuid();
            _context.TypeDossiers.Add(typeDossier);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTypeDossierById), new { id = typeDossier.Id }, typeDossier);
        }

        //  mettre à jour un type de dossier
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateTypeDossier(Guid id, [FromBody] TypeDossier updatedTypeDossier)
        {
            var typeDossier = await _context.TypeDossiers.FindAsync(id);
            if (typeDossier == null)
                return NotFound(new { message = "Le type de dossier n'a pas été trouvé." });

            if (updatedTypeDossier == null || string.IsNullOrWhiteSpace(updatedTypeDossier.Name))
                return BadRequest(new { message = "Les informations du type de dossier sont invalides." });

            typeDossier.Name = updatedTypeDossier.Name;
            typeDossier.Description = updatedTypeDossier.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // supprimer un type de dossier
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteTypeDossier(Guid id)
        {
            var typeDossier = await _context.TypeDossiers
                .Include(td => td.Dossiers)
                .Include(td => td.Rendezvous)
                .Include(td => td.DocumentTypes)
                .FirstOrDefaultAsync(td => td.Id == id);

            if (typeDossier == null)
                return NotFound(new { message = "Le type de dossier n'a pas été trouvé." });

            if (typeDossier.Dossiers.Any() || typeDossier.Rendezvous.Any() || typeDossier.DocumentTypes.Any())
                return BadRequest(new { message = "Impossible de supprimer ce type de dossier car il est lié à d'autres entités." });

            _context.TypeDossiers.Remove(typeDossier);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
