using CitizenServer.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.Interfaces
{
    public interface IDossierAdministratifService
    {
        Task<IEnumerable<DossierAdministratifDTO>> GetAllDossiersAsync();
        Task<DossierAdministratifDTO> GetDossierByIdAsync(Guid id);
        Task<DossierAdministratifDTO> CreateDossierAsync(DossierAdministratifDTO dossier);
        Task<DossierAdministratifDTO> UpdateDossierAsync(DossierAdministratifDTO dossier);
        Task<bool> DeleteDossierAsync(Guid id);
        Task<bool> CompleteDossierAsync(Guid id);
    }
}
