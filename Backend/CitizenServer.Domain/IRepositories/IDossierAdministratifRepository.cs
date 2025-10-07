using CitizenServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Domain.IRepositories
{
    public interface IDossierAdministratifRepository
    {
        Task<IEnumerable<DossierAdministratif>> GetAllDossiersAsync();
        Task<DossierAdministratif> GetDossierByIdAsync(Guid id);
        Task AddDossierAsync(DossierAdministratif dossier);
        Task UpdateDossierAsync(DossierAdministratif dossier);
        Task DeleteDossierAsync(Guid id);
    }
}
