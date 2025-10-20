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
    public class DossierAdministratifService : IDossierAdministratifService
    {
        private readonly CitizenServiceDbContext _context;

        public DossierAdministratifService(CitizenServiceDbContext context)
        {
            _context = context;
        }

        // Récupérer tous les dossiers d'un utilisateur
        public async Task<IEnumerable<DossierAdministratifDTO>> GetAllDossiersAsync()
        {
            var dossiers = await _context.Dossiers
                .Include(d => d.TypeDossier)
                .Include(d => d.Documents)
                .ToListAsync();

            return dossiers.Select(MapToDTO);
        }

        // Récupérer un dossier par ID
        public async Task<DossierAdministratifDTO> GetDossierByIdAsync(Guid id)
        {
            var dossier = await _context.Dossiers
                .Include(d => d.TypeDossier)
                .Include(d => d.Documents)
                .FirstOrDefaultAsync(d => d.Id == id);

            return dossier == null ? null : MapToDTO(dossier);
        }

        // Créer un nouveau dossier
        public async Task<DossierAdministratifDTO> CreateDossierAsync(DossierAdministratifDTO dto)
        {
            if (dto == null) return null;

            var entity = new DossierAdministratif
            {
                Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
                UserId = dto.UserId,
                TypeDossierId = dto.TypeDossierId,
                Status = dto.Status,
                SubmissionDate = dto.SubmissionDate,
                ValidationDate = dto.ValidationDate,
                IsCompleted = dto.IsCompleted
            };

            _context.Dossiers.Add(entity);
            await _context.SaveChangesAsync();

            return MapToDTO(entity);
        }

        // Mettre à jour un dossier
        public async Task<DossierAdministratifDTO> UpdateDossierAsync(DossierAdministratifDTO dto)
        {
            var entity = await _context.Dossiers.FindAsync(dto.Id);
            if (entity == null) return null;

            entity.TypeDossierId = dto.TypeDossierId;
            entity.Status = dto.Status;
            entity.SubmissionDate = dto.SubmissionDate;
            entity.ValidationDate = dto.ValidationDate;
            entity.IsCompleted = dto.IsCompleted;

            await _context.SaveChangesAsync();

            return MapToDTO(entity);
        }

        // Supprimer un dossier
        public async Task<bool> DeleteDossierAsync(Guid id)
        {
            var entity = await _context.Dossiers.FindAsync(id);
            if (entity == null) return false;

            _context.Dossiers.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> CompleteDossierAsync(Guid id)
        {
            var entity = await _context.Dossiers.FindAsync(id);
            if (entity == null) return false;

            entity.IsCompleted = true;
            entity.Status = "Complet";
            await _context.SaveChangesAsync();
            return true;
        }

       
        private static DossierAdministratifDTO MapToDTO(DossierAdministratif entity)
        {
            return new DossierAdministratifDTO
            {
                Id = entity.Id,
                UserId = entity.UserId,
                TypeDossierId = entity.TypeDossierId,
                Status = entity.Status,
                SubmissionDate = entity.SubmissionDate,
                ValidationDate = entity.ValidationDate,
                IsCompleted = entity.IsCompleted
            };
        }
    }
}
