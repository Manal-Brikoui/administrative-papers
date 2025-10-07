using CitizenServer.Application.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Application.Interfaces
{
    public interface IRendezvousService
    {
        Task<IEnumerable<RendezvousDTO>> GetAllRendezvousAsync(Guid userId);
        Task<RendezvousDTO> GetRendezvousByIdAsync(Guid id);
        Task<RendezvousDTO> ScheduleRendezvousAsync(RendezvousDTO rendezvous);
        Task<RendezvousDTO> UpdateRendezvousAsync(RendezvousDTO rendezvous);
        Task<bool> CancelRendezvousAsync(Guid id);
    }
}
