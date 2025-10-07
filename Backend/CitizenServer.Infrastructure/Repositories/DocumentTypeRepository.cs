using CitizenServer.Domain.Entities;
using CitizenServer.Domain.IRepositories;
using CitizenServer.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Infrastructure.Repositories
{
    public class DocumentTypeRepository : IDocumentTypeRepository
    {
        private readonly CitizenServiceDbContext _context;

        public DocumentTypeRepository(CitizenServiceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DocumentType>> GetAllDocumentTypesAsync()
        {
            return await _context.DocumentTypes.Include(dt => dt.CategoryEntity).Include(dt => dt.TypeDossierEntity).ToListAsync();
        }

        public async Task<DocumentType> GetDocumentTypeByIdAsync(Guid id)
        {
            return await _context.DocumentTypes.Include(dt => dt.CategoryEntity).Include(dt => dt.TypeDossierEntity).FirstOrDefaultAsync(dt => dt.Id == id);
        }

        public async Task AddDocumentTypeAsync(DocumentType documentType)
        {
            await _context.DocumentTypes.AddAsync(documentType);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDocumentTypeAsync(DocumentType documentType)
        {
            _context.DocumentTypes.Update(documentType);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDocumentTypeAsync(Guid id)
        {
            var documentType = await GetDocumentTypeByIdAsync(id);
            if (documentType != null)
            {
                _context.DocumentTypes.Remove(documentType);
                await _context.SaveChangesAsync();
            }
        }
    }
}
