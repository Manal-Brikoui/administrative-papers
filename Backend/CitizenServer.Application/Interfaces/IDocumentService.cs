using CitizenServer.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.Interfaces
{
    public interface IDocumentService
    {
        Task<IEnumerable<DocumentDTO>> GetAllDocumentsAsync();
        Task<DocumentDTO> GetDocumentByIdAsync(Guid id);
        Task<DocumentDTO> UploadDocumentAsync(DocumentDTO document);
        Task<DocumentDTO> UpdateDocumentAsync(DocumentDTO document);
        Task<bool> DeleteDocumentAsync(Guid id);
    }
}
