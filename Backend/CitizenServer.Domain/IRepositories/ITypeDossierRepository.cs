using CitizenServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CitizenServer.Domain.IRepositories
{
    public interface ITypeDossierRepository
    {
        Task<IEnumerable<TypeDossier>> GetAllTypesDossierAsync();  
        Task<TypeDossier> GetTypeDossierByIdAsync(Guid id);
        Task AddTypeDossierAsync(TypeDossier typeDossier);
        Task UpdateTypeDossierAsync(TypeDossier typeDossier);
        Task DeleteTypeDossierAsync(Guid id);
    }
}
