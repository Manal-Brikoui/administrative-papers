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
    public class TypeDossierService : ITypeDossierService
    {
        private readonly CitizenServiceDbContext _context;

        public TypeDossierService(CitizenServiceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TypeDossierDTO>> GetAllTypeDossiersAsync()
        {
            var entities = await _context.TypeDossiers
                .Include(td => td.Dossiers)
                .Include(td => td.Rendezvous)
                .Include(td => td.DocumentTypes)
                .ToListAsync();

            return entities.Select(MapToDTO);
        }

        public async Task<TypeDossierDTO> GetTypeDossierByIdAsync(Guid id)
        {
            var entity = await _context.TypeDossiers
                .Include(td => td.Dossiers)
                .Include(td => td.Rendezvous)
                .Include(td => td.DocumentTypes)
                .FirstOrDefaultAsync(td => td.Id == id);

            return entity == null ? null : MapToDTO(entity);
        }

        public async Task<TypeDossierDTO> CreateTypeDossierAsync(TypeDossierDTO dto)
        {
            if (dto == null) return null;

            var entity = new TypeDossier
            {
                Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
                Name = dto.Name,
                Description = dto.Description
            };

            _context.TypeDossiers.Add(entity);
            await _context.SaveChangesAsync();

            return MapToDTO(entity);
        }

        public async Task<TypeDossierDTO> UpdateTypeDossierAsync(TypeDossierDTO dto)
        {
            var entity = await _context.TypeDossiers.FindAsync(dto.Id);
            if (entity == null) return null;

            entity.Name = dto.Name;
            entity.Description = dto.Description;

            await _context.SaveChangesAsync();
            return MapToDTO(entity);
        }

        public async Task<bool> DeleteTypeDossierAsync(Guid id)
        {
            var entity = await _context.TypeDossiers.FindAsync(id);
            if (entity == null) return false;

            _context.TypeDossiers.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapping Entity -> DTO
        private static TypeDossierDTO MapToDTO(TypeDossier entity)
        {
            return new TypeDossierDTO
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description
            };
        }
    }
}
