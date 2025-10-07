using CitizenServer.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.Interfaces
{
    public interface IDocumentTypeService
    {
        Task<IEnumerable<DocumentTypeDTO>> GetAllDocumentTypesAsync();
        Task<DocumentTypeDTO> GetDocumentTypeByIdAsync(Guid id);
        Task<DocumentTypeDTO> CreateDocumentTypeAsync(DocumentTypeDTO documentType);
        Task<DocumentTypeDTO> UpdateDocumentTypeAsync(DocumentTypeDTO documentType);
        Task<bool> DeleteDocumentTypeAsync(Guid id);
    }
}
