using CitizenServer.Domain.Entities;
using CitizenServer.Domain.IRepositories;
using CitizenServer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CitizenServer.Infrastructure.Repositories
{
    public class TypeDossierRepository : ITypeDossierRepository
    {
        private readonly CitizenServiceDbContext _context;

     
        public TypeDossierRepository(CitizenServiceDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Récupérer tous les types de dossiers avec les dossiers associés
        public async Task<IEnumerable<TypeDossier>> GetAllTypesDossierAsync()
        {
            return await _context.TypeDossiers
                .Include(t => t.Dossiers)  // Inclure les dossiers associés
                .ToListAsync();
        }

        // Récupérer un type de dossier par son identifiant
        public async Task<TypeDossier> GetTypeDossierByIdAsync(Guid id)
        {
            return await _context.TypeDossiers
                .Include(t => t.Dossiers)  // Inclure les dossiers associés
                .FirstOrDefaultAsync(t => t.Id == id);  // Recherche par ID
        }

        // Ajouter un nouveau type de dossier
        public async Task AddTypeDossierAsync(TypeDossier typeDossier)
        {
            if (typeDossier == null)
                throw new ArgumentNullException(nameof(typeDossier));

            await _context.TypeDossiers.AddAsync(typeDossier);  // Ajouter un nouveau type de dossier
            await _context.SaveChangesAsync();  
        }

        // Mettre à jour un type de dossier existant
        public async Task UpdateTypeDossierAsync(TypeDossier typeDossier)
        {
            if (typeDossier == null)
                throw new ArgumentNullException(nameof(typeDossier));

            _context.TypeDossiers.Update(typeDossier);  // Mettre à jour le type de dossier
            await _context.SaveChangesAsync();  
        }

        // Supprimer un type de dossier par son identifiant
        public async Task DeleteTypeDossierAsync(Guid id)
        {
            var typeDossier = await GetTypeDossierByIdAsync(id);  // Trouver le type de dossier par ID
            if (typeDossier != null)
            {
                _context.TypeDossiers.Remove(typeDossier);  // Supprimer le type de dossier
                await _context.SaveChangesAsync();  
            }
            else
            {
                throw new InvalidOperationException("TypeDossier not found.");
            }
        }
    }
}
