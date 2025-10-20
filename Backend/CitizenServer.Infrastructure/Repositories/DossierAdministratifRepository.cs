using CitizenServer.Domain.Entities;
using CitizenServer.Domain.IRepositories;
using CitizenServer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore; 

namespace CitizenService.Infrastructure.Repositories
{
    public class DossierAdministratifRepository : IDossierAdministratifRepository
    {
        private readonly CitizenServiceDbContext _context;

       
        public DossierAdministratifRepository(CitizenServiceDbContext context)
        {
            _context = context;
        }

        // Récupérer tous les dossiers administratifs avec leurs types associés
        public async Task<IEnumerable<DossierAdministratif>> GetAllDossiersAsync()
        {
            return await _context.Dossiers.Include(d => d.TypeDossier).ToListAsync();  // Utilisation du bon DbSet
        }

        // Récupérer un dossier administratif par son identifiant
        public async Task<DossierAdministratif> GetDossierByIdAsync(Guid id)
        {
            return await _context.Dossiers.Include(d => d.TypeDossier).FirstOrDefaultAsync(d => d.Id == id);  // Correction sur la table et la logique
        }

        // Ajouter un nouveau dossier administratif
        public async Task AddDossierAsync(DossierAdministratif dossier)
        {
            await _context.Dossiers.AddAsync(dossier);  // Correction du nom du DbSet
            await _context.SaveChangesAsync();
        }

        // Mettre à jour un dossier administratif existant
        public async Task UpdateDossierAsync(DossierAdministratif dossier)
        {
            _context.Dossiers.Update(dossier);  // Correction du nom du DbSet
            await _context.SaveChangesAsync();
        }

        // Supprimer un dossier administratif par son identifiant
        public async Task DeleteDossierAsync(Guid id)
        {
            var dossier = await GetDossierByIdAsync(id);
            if (dossier != null)
            {
                _context.Dossiers.Remove(dossier);  
                await _context.SaveChangesAsync();
            }
        }
    }
}
