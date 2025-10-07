using CitizenServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Domain.IRepositories
{
    public interface IDocumentTypeRepository
    {
        Task<IEnumerable<DocumentType>> GetAllDocumentTypesAsync();
        Task<DocumentType> GetDocumentTypeByIdAsync(Guid id);
        Task AddDocumentTypeAsync(DocumentType documentType);
        Task UpdateDocumentTypeAsync(DocumentType documentType);
        Task DeleteDocumentTypeAsync(Guid id);
    }
}
