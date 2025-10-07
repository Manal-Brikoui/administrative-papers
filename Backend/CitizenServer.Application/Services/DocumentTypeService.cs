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
    public class DocumentTypeService : IDocumentTypeService
    {
        private readonly CitizenServiceDbContext _context;

        public DocumentTypeService(CitizenServiceDbContext context)
        {
            _context = context;
        }

        // Récupérer tous les types de documents
        public async Task<IEnumerable<DocumentTypeDTO>> GetAllDocumentTypesAsync()
        {
            var documentTypes = await _context.DocumentTypes
                .Include(dt => dt.CategoryEntity)
                .Include(dt => dt.TypeDossierEntity)
                .ToListAsync();

            return documentTypes.Select(MapToDTO);
        }

        // Récupérer un type de document par ID
        public async Task<DocumentTypeDTO> GetDocumentTypeByIdAsync(Guid id)
        {
            var documentType = await _context.DocumentTypes
                .Include(dt => dt.CategoryEntity)
                .Include(dt => dt.TypeDossierEntity)
                .FirstOrDefaultAsync(dt => dt.Id == id);

            return documentType == null ? null : MapToDTO(documentType);
        }

        // Créer un type de document
        public async Task<DocumentTypeDTO> CreateDocumentTypeAsync(DocumentTypeDTO dto)
        {
            if (dto == null) return null;

            var entity = MapToEntity(dto);
            _context.DocumentTypes.Add(entity);
            await _context.SaveChangesAsync();

            // Charger les relations pour le DTO
            await _context.Entry(entity).Reference(d => d.CategoryEntity).LoadAsync();
            await _context.Entry(entity).Reference(d => d.TypeDossierEntity).LoadAsync();

            return MapToDTO(entity);
        }

        // Mettre à jour un type de document
        public async Task<DocumentTypeDTO> UpdateDocumentTypeAsync(DocumentTypeDTO dto)
        {
            var entity = await _context.DocumentTypes.FindAsync(dto.Id);
            if (entity == null) return null;

            entity.Name = dto.Name;
            entity.IsImportable = dto.IsImportable;
            entity.CategoryId = dto.CategoryId;
            entity.TypeDossierId = dto.TypeDossierId;

            await _context.SaveChangesAsync();

            // Recharger les relations pour le DTO
            await _context.Entry(entity).Reference(d => d.CategoryEntity).LoadAsync();
            await _context.Entry(entity).Reference(d => d.TypeDossierEntity).LoadAsync();

            return MapToDTO(entity);
        }

        // Supprimer un type de document
        public async Task<bool> DeleteDocumentTypeAsync(Guid id)
        {
            var entity = await _context.DocumentTypes.FindAsync(id);
            if (entity == null) return false;

            _context.DocumentTypes.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // Mapping Entity -> DTO
        private static DocumentTypeDTO MapToDTO(DocumentType entity)
        {
            return new DocumentTypeDTO
            {
                Id = entity.Id,
                Name = entity.Name,
                IsImportable = entity.IsImportable,
                CategoryId = entity.CategoryId,
                TypeDossierId = entity.TypeDossierId,
                Category = entity.CategoryEntity?.Name ?? string.Empty
            };
        }

        // Mapping DTO -> Entity
        private static DocumentType MapToEntity(DocumentTypeDTO dto)
        {
            return new DocumentType
            {
                Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
                Name = dto.Name,
                IsImportable = dto.IsImportable,
                CategoryId = dto.CategoryId,
                TypeDossierId = dto.TypeDossierId
            };
        }
    }
}
