using CitizenServer.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CitizenServer.Domain.IRepositories
{
    public interface IRendezvousRepository
    {
        Task<IEnumerable<Rendezvous>> GetAllRendezvousAsync();
        Task<Rendezvous> GetRendezvousByIdAsync(Guid id);
        Task AddRendezvousAsync(Rendezvous rendezvous);
        Task UpdateRendezvousAsync(Rendezvous rendezvous);
        Task DeleteRendezvousAsync(Guid id);
    }
}
