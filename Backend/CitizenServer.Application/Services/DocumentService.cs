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
    public class DocumentService : IDocumentService
    {
        private readonly CitizenServiceDbContext _context;

        public DocumentService(CitizenServiceDbContext context)
        {
            _context = context;
        }

        // Récupérer tous les documents
        public async Task<IEnumerable<DocumentDTO>> GetAllDocumentsAsync()
        {
            var documents = await _context.Documents
                .Include(d => d.DossierAdministratif)
                .ToListAsync();

            return documents.Select(MapToDTO);
        }

        // Récupérer un document par Id
        public async Task<DocumentDTO> GetDocumentByIdAsync(Guid id)
        {
            var document = await _context.Documents
                .Include(d => d.DossierAdministratif)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (document == null)
                throw new KeyNotFoundException($"Document avec l'id {id} non trouvé.");

            return MapToDTO(document);
        }

        
        public async Task<DocumentDTO> UploadDocumentAsync(DocumentDTO dto)
        {
            var entity = MapToEntity(dto);
            _context.Documents.Add(entity);
            await _context.SaveChangesAsync();

            return MapToDTO(entity);
        }

        // Mettre à jour un document
        public async Task<DocumentDTO> UpdateDocumentAsync(DocumentDTO dto)
        {
            var entity = await _context.Documents
                .FirstOrDefaultAsync(d => d.Id == dto.Id);

            if (entity == null)
                throw new KeyNotFoundException($"Document avec l'id {dto.Id} non trouvé.");

            // Mise à jour des champs
            entity.UserId = dto.UserId;
            entity.DossierAdministratifId = Guid.TryParse(dto.DossierAdministratifId, out var gid) ? gid : Guid.Empty;
            entity.Type = dto.Type;
            entity.FilePath = dto.FilePath;
            entity.UploadDate = dto.UploadDate;
            entity.IsOnPlatform = dto.IsOnPlatform;
            entity.ImportLocation = dto.ImportLocation;

            await _context.SaveChangesAsync();
            return MapToDTO(entity);
        }

        // Supprimer un document
        public async Task<bool> DeleteDocumentAsync(Guid id)
        {
            var entity = await _context.Documents.FindAsync(id);
            if (entity == null) return false;

            _context.Documents.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        
        private static DocumentDTO MapToDTO(Document entity)
        {
            return new DocumentDTO
            {
                Id = entity.Id,
                UserId = entity.UserId,
                DossierAdministratifId = entity.DossierAdministratifId.ToString(),
                Type = entity.Type,
                FilePath = entity.FilePath,
                UploadDate = entity.UploadDate,
                IsOnPlatform = entity.IsOnPlatform,
                ImportLocation = entity.ImportLocation
            };
        }

        
        private static Document MapToEntity(DocumentDTO dto)
        {
            return new Document
            {
                Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
                UserId = dto.UserId,
                DossierAdministratifId = Guid.TryParse(dto.DossierAdministratifId, out var gid) ? gid : Guid.Empty,
                Type = dto.Type,
                FilePath = dto.FilePath,
                UploadDate = dto.UploadDate == default ? DateTime.UtcNow : dto.UploadDate,
                IsOnPlatform = dto.IsOnPlatform,
                ImportLocation = dto.ImportLocation
            };
        }
    }
}
