using CitizenServer.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.Interfaces
{
    public interface ITypeDossierService
    {
        Task<IEnumerable<TypeDossierDTO>> GetAllTypeDossiersAsync();
        Task<TypeDossierDTO> GetTypeDossierByIdAsync(Guid id);
        Task<TypeDossierDTO> CreateTypeDossierAsync(TypeDossierDTO typeDossier);
        Task<TypeDossierDTO> UpdateTypeDossierAsync(TypeDossierDTO typeDossier);
        Task<bool> DeleteTypeDossierAsync(Guid id);
    }
}
