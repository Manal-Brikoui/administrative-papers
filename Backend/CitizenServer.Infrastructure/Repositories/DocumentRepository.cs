using CitizenServer.Domain.IRepositories;
using CitizenServer.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CitizenServer.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CitizenServer.Infrastructure.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly CitizenServiceDbContext _context;

        public DocumentRepository(CitizenServiceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Document>> GetAllDocumentsAsync()
        {
            return await _context.Documents.Include(d => d.DossierAdministratif).ToListAsync();
        }

        public async Task<Document> GetDocumentByIdAsync(Guid id)
        {
            return await _context.Documents.Include(d => d.DossierAdministratif).FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task AddDocumentAsync(Document document)
        {
            await _context.Documents.AddAsync(document);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateDocumentAsync(Document document)
        {
            _context.Documents.Update(document);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDocumentAsync(Guid id)
        {
            var document = await GetDocumentByIdAsync(id);
            if (document != null)
            {
                _context.Documents.Remove(document);
                await _context.SaveChangesAsync();
            }
        }
    }
}
