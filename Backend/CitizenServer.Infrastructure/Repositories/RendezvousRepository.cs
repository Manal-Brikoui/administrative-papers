using CitizenServer.Domain.Entities;
using CitizenServer.Domain.IRepositories;
using CitizenServer.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
namespace CitizenServer.Infrastructure.Repositories
{
    public class RendezvousRepository : IRendezvousRepository
    {
        private readonly CitizenServiceDbContext _context;

        public RendezvousRepository(CitizenServiceDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Rendezvous>> GetAllRendezvousAsync()
        {
            return await _context.Rendezvous.Include(r => r.TypeDossier).ToListAsync();
        }

        public async Task<Rendezvous> GetRendezvousByIdAsync(Guid id)
        {
            return await _context.Rendezvous.Include(r => r.TypeDossier).FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task AddRendezvousAsync(Rendezvous rendezvous)
        {
            await _context.Rendezvous.AddAsync(rendezvous);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRendezvousAsync(Rendezvous rendezvous)
        {
            _context.Rendezvous.Update(rendezvous);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRendezvousAsync(Guid id)
        {
            var rendezvous = await GetRendezvousByIdAsync(id);
            if (rendezvous != null)
            {
                _context.Rendezvous.Remove(rendezvous);
                await _context.SaveChangesAsync();
            }
        }
    }
}
